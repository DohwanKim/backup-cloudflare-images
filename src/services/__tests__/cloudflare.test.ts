import { CloudflareImageService } from '../cloudflare';
import axios from 'axios';

jest.mock('axios');

describe('CloudflareImageService', () => {
  let service: CloudflareImageService;
  const mockAccountId = 'test-account-id';
  const mockApiToken = 'test-api-token';
  let mockAxiosGet: jest.Mock;

  beforeEach(() => {
    mockAxiosGet = jest.fn();
    (axios.create as jest.Mock).mockReturnValue({
      get: mockAxiosGet,
    });
    service = new CloudflareImageService(mockAccountId, mockApiToken);
    jest.clearAllMocks();
  });

  describe('listImages', () => {
    it('성공적으로 이미지 목록을 가져와야 합니다', async () => {
      const mockImages = [
        {
          id: 'image-1',
          filename: 'test1.jpg',
          uploaded: '2024-03-15T00:00:00Z',
          requireSignedURLs: false,
          variants: ['public'],
        },
      ];

      mockAxiosGet.mockResolvedValueOnce({
        data: {
          success: true,
          result: { images: mockImages },
        },
      });

      const result = await service.listImages();
      expect(result).toEqual(mockImages);
      expect(mockAxiosGet).toHaveBeenCalledWith('', expect.any(Object));
    });

    it('API 호출 실패시 에러를 던져야 합니다', async () => {
      mockAxiosGet.mockRejectedValueOnce(new Error('API Error'));

      await expect(service.listImages()).rejects.toThrow('API Error');
    });
  });

  describe('downloadImage', () => {
    it('성공적으로 이미지를 다운로드해야 합니다', async () => {
      const mockImageData = Buffer.from('mock-image-data');

      mockAxiosGet.mockResolvedValueOnce({
        data: mockImageData,
      });

      const result = await service.downloadImage('test-image-id');
      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result).toEqual(mockImageData);
      expect(mockAxiosGet).toHaveBeenCalledWith('/test-image-id/blob', expect.any(Object));
    });

    it('다운로드 실패시 에러를 던져야 합니다', async () => {
      mockAxiosGet.mockRejectedValueOnce(new Error('Download Error'));

      await expect(service.downloadImage('test-image-id')).rejects.toThrow('Download Error');
    });
  });
});
