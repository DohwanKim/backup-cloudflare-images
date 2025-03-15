import dotenv from 'dotenv';
import { CloudflareImageService } from './services/cloudflare';
import { BackupService } from './services/backup';

dotenv.config();

async function main() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    console.error('환경 변수가 설정되지 않았습니다. CLOUDFLARE_ACCOUNT_ID와 CLOUDFLARE_API_TOKEN을 확인해주세요.');
    process.exit(1);
  }

  const cloudflareService = new CloudflareImageService(accountId, apiToken);
  const backupService = new BackupService(cloudflareService);

  try {
    console.log('Cloudflare Images 백업을 시작합니다...');
    await backupService.startBackup();
    console.log('백업이 완료되었습니다.');
  } catch (error) {
    console.error('백업 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

main();
