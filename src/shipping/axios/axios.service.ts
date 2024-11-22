import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { AppConfigService } from 'src/lib/config/config.service';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class AxiosService implements OnModuleInit {
  private readonly axiosInstance: AxiosInstance;
  private readonly logger = new Logger('AxiosService');
  private activeRequests = new Map<
    string,
    {
      method: string;
      url: string;
      startTime: number;
    }
  >();
  private isInitialized = false;

  constructor(
    private readonly configService: AppConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.shiprocketApiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
      timeoutErrorMessage: 'ShipRocket API request timed out',
    });

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Ensure service is initialized before making any request
        if (!this.isInitialized && config.url !== '/auth/login') {
          await this.initializeService();
        }

        const requestId = Math.random().toString(36).substring(7);
        this.activeRequests.set(requestId, {
          method: config.method?.toUpperCase() || 'UNKNOWN',
          url: config.url || 'UNKNOWN',
          startTime: Date.now(),
        });

        // Log current active requests
        const now = Date.now();
        this.logger.log(
          Array.from(this.activeRequests.entries()).map(([id, req]) => ({
            id,
            method: req.method,
            url: req.url,
            duration: `${(now - req.startTime) / 1000}s`,
          })),
        );

        // Only add auth token if not a login request
        if (config.url !== '/auth/login') {
          const token = await this.getValidToken();
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        config.headers['X-Request-ID'] = requestId;
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        const requestId = response.config.headers['X-Request-ID'];
        if (requestId) {
          this.activeRequests.delete(requestId);
        }
        return response;
      },
      (error) => {
        const requestId = error.config?.headers['X-Request-ID'];
        if (requestId) {
          this.activeRequests.delete(requestId);
        }
        return Promise.reject(error);
      },
    );
  }

  async onModuleInit() {
    await this.initializeService();
  }

  private async initializeService() {
    if (this.isInitialized) return;

    try {
      this.logger.log('Initializing ShipRocket service...');
      await this.getValidToken();
      this.isInitialized = true;
      this.logger.log('ShipRocket service initialized successfully');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig<any>): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig<any>,
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any>,
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig<any>): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  private handleAxiosError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      this.logger.error(
        'ShipRocket API error:',
        axiosError.response?.data || axiosError.message,
      );

      if (axiosError.response?.status === 404) {
        throw new NotFoundException('ShipRocket resource not found');
      }

      throw new InternalServerErrorException(
        `ShipRocket API error: ${axiosError.response?.data?.message || axiosError.message}`,
      );
    }

    this.logger.error('Unexpected error:', error);
    throw new InternalServerErrorException('An unexpected error occurred');
  }

  private async generateNewToken(): Promise<string> {
    const response = await this.axiosInstance.post('/auth/login', {
      email: this.configService.shiprocketEmail,
      password: this.configService.shiprocketPassword,
    });
    this.logger.log('response', response);
    if (!response?.data?.token) {
      throw new InternalServerErrorException('Failed to get shiprocket token');
    }
    const token = response.data.token;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 10);
    await this.prismaService.shipRocketToken.create({
      data: {
        token,
        expiresAt,
      },
    });
    return token;
  }

  private async getValidToken(): Promise<string> {
    try {
      const tokenEntity = await this.prismaService.shipRocketToken.findFirst({
        where: { expiresAt: { gt: new Date() } },
        orderBy: { expiresAt: 'desc' },
      });

      if (tokenEntity) {
        return tokenEntity.token;
      }

      return await this.generateNewToken();
    } catch (error: any) {
      this.logger.error('Error getting valid token', error);
      throw new InternalServerErrorException(error?.response?.data);
    }
  }
}
