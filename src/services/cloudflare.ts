import axios, { AxiosInstance } from 'axios';
import { writeFileSync } from 'fs';
import path from 'path';

export interface CloudflareImage {
  id: string;
  filename: string;
  uploaded: string;
  requireSignedURLs: boolean;
  variants: string[];
}

export class CloudflareImageService {
  private client: AxiosInstance;
  private accountId: string;

  constructor(accountId: string, apiToken: string) {
    this.accountId = accountId;
    this.client = axios.create({
      baseURL: `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async listImages(page: number = 1, perPage: number = 100): Promise<CloudflareImage[]> {
    try {
      const response = await this.client.get('', {
        params: {
          page,
          per_page: perPage,
        },
      });

      if (!response.data.success) {
        throw new Error('이미지 목록을 가져오는데 실패했습니다.');
      }

      return response.data.result.images;
    } catch (error) {
      console.error('이미지 목록 조회 중 오류:', error);
      throw error;
    }
  }

  async downloadImage(imageId: string, variant: string = 'public'): Promise<Buffer> {
    try {
      const response = await this.client.get(`/${imageId}/blob`, {
        params: { variant },
        responseType: 'arraybuffer',
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error(`이미지 다운로드 중 오류 (ID: ${imageId}):`, error);
      throw error;
    }
  }
}
