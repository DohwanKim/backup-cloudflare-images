import { CloudflareImageService, CloudflareImage } from './cloudflare';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

export class BackupService {
  private cloudflareService: CloudflareImageService;
  private backupDir: string;

  constructor(cloudflareService: CloudflareImageService) {
    this.cloudflareService = cloudflareService;
    this.backupDir = path.join(process.cwd(), 'backups');
    this.ensureBackupDirectory();
  }

  private ensureBackupDirectory(): void {
    if (!existsSync(this.backupDir)) {
      mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async startBackup(): Promise<void> {
    try {
      let page = 1;
      let hasMore = true;
      let totalImages = 0;

      while (hasMore) {
        const images = await this.cloudflareService.listImages(page);
        if (images.length === 0) {
          hasMore = false;
          continue;
        }

        for (const image of images) {
          await this.backupImage(image);
          totalImages++;
        }

        console.log(`${totalImages}개의 이미지가 백업되었습니다.`);
        page++;
      }

      console.log(`백업이 완료되었습니다. 총 ${totalImages}개의 이미지가 백업되었습니다.`);
    } catch (error) {
      console.error('백업 프로세스 중 오류가 발생했습니다:', error);
      throw error;
    }
  }

  private async backupImage(image: CloudflareImage): Promise<void> {
    try {
      const imageData = await this.cloudflareService.downloadImage(image.id);
      const fileName = `${image.id}_${image.filename}`;
      const filePath = path.join(this.backupDir, fileName);

      writeFileSync(filePath, imageData);
      console.log(`이미지가 백업되었습니다: ${fileName}`);
    } catch (error) {
      console.error(`이미지 백업 중 오류 발생 (${image.id}):`, error);
      throw error;
    }
  }
}
