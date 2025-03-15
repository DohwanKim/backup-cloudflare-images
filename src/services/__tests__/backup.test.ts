import { BackupService } from '../backup';
import { CloudflareImageService, CloudflareImage } from '../cloudflare';
import fs from 'fs';
import path from 'path';

jest.mock('../cloudflare');
jest.mock('fs');
jest.mock('path');

describe('BackupService', () => {
  let backupService: BackupService;
  let mockCloudflareService: jest.Mocked<CloudflareImageService>;

  const mockImage: CloudflareImage = {
    id: 'test-image-id',
    filename: 'test.jpg',
    uploaded: '2024-03-15T00:00:00Z',
    requireSignedURLs: false,
    variants: ['public'],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock CloudflareImageService
    mockCloudflareService = {
      listImages: jest.fn(),
      downloadImage: jest.fn(),
    } as any;

    // Mock path.join to return a predictable path
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
  });

  describe('startBackup', () => {
    beforeEach(() => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => undefined);
      backupService = new BackupService(mockCloudflareService);
    });

    it('성공적으로 모든 이미지를 백업해야 합니다', async () => {
      mockCloudflareService.listImages.mockResolvedValueOnce([mockImage]).mockResolvedValueOnce([]);

      mockCloudflareService.downloadImage.mockResolvedValue(Buffer.from('mock-image-data'));

      await backupService.startBackup();

      expect(mockCloudflareService.listImages).toHaveBeenCalledTimes(2);
      expect(mockCloudflareService.downloadImage).toHaveBeenCalledWith(mockImage.id);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('이미지 목록 조회 실패시 에러를 던져야 합니다', async () => {
      mockCloudflareService.listImages.mockRejectedValue(new Error('API Error'));

      await expect(backupService.startBackup()).rejects.toThrow('API Error');
    });

    it('이미지 다운로드 실패시 에러를 던져야 합니다', async () => {
      mockCloudflareService.listImages.mockResolvedValue([mockImage]);

      mockCloudflareService.downloadImage.mockRejectedValue(new Error('Download Error'));

      await expect(backupService.startBackup()).rejects.toThrow('Download Error');
    });
  });

  describe('백업 디렉토리 관리', () => {
    it('백업 디렉토리가 없을 경우 생성해야 합니다', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      backupService = new BackupService(mockCloudflareService);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    });

    it('백업 디렉토리가 이미 존재할 경우 생성하지 않아야 합니다', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.mkdirSync as jest.Mock).mockClear();

      backupService = new BackupService(mockCloudflareService);

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });
});
