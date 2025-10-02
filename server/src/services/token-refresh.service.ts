import jwt from 'jsonwebtoken';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export class TokenRefreshService {
  private static instance: TokenRefreshService;
  private refreshInterval: NodeJS.Timeout | null = null;
  private currentToken: string | null = null;
  private tokenExpiry: number = 0;

  private constructor() {}

  static getInstance(): TokenRefreshService {
    if (!TokenRefreshService.instance) {
      TokenRefreshService.instance = new TokenRefreshService();
    }
    return TokenRefreshService.instance;
  }

  async refreshIAMToken(): Promise<string> {
    try {
      const keyPath = path.join(__dirname, '..', '..', 'authorized_key.json');

      if (!fs.existsSync(keyPath)) {
        console.error('authorized_key.json not found, skipping IAM token refresh');
        return process.env.YANDEX_IAM_TOKEN || '';
      }

      const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      const privateKey = keyData.private_key;
      const serviceAccountId = keyData.service_account_id;
      const keyId = keyData.id;

      const now = Math.floor(Date.now() / 1000);
      const payload = {
        aud: 'https://iam.api.cloud.yandex.net/iam/v1/tokens',
        iss: serviceAccountId,
        iat: now,
        exp: now + 3600
      };

      const token = jwt.sign(payload, privateKey, {
        algorithm: 'PS256',
        keyid: keyId
      });

      const response = await axios.post(
        'https://iam.api.cloud.yandex.net/iam/v1/tokens',
        { jwt: token }
      );

      this.currentToken = response.data.iamToken;
      this.tokenExpiry = Date.now() + (12 * 60 * 60 * 1000); // 12 hours

      // Update environment variable
      if (this.currentToken) {
        process.env.YANDEX_IAM_TOKEN = this.currentToken;
      }

      console.log('IAM Token refreshed successfully at', new Date().toISOString());
      return this.currentToken || '';
    } catch (error: any) {
      console.error('Failed to refresh IAM token:', error.message);
      throw error;
    }
  }

  startAutoRefresh(): void {
    // Refresh immediately on start
    this.refreshIAMToken().catch(console.error);

    // Refresh every 11 hours (before the 12-hour expiry)
    this.refreshInterval = setInterval(() => {
      this.refreshIAMToken().catch(console.error);
    }, 11 * 60 * 60 * 1000); // 11 hours

    console.log('IAM Token auto-refresh started (every 11 hours)');
  }

  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('IAM Token auto-refresh stopped');
    }
  }

  getCurrentToken(): string | null {
    return this.currentToken;
  }

  getTokenExpiry(): number {
    return this.tokenExpiry;
  }
}
