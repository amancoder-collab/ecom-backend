import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { AppConfigService } from 'src/lib/config/config.service';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class ShipRocketApiService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    private readonly configService: AppConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.shiprocketApiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getValidToken();
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error),
    );
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
      console.error(
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

    console.error('Unexpected error:', error);
    throw new InternalServerErrorException('An unexpected error occurred');
  }

  private async generateNewToken(): Promise<string> {
    const response = await this.axiosInstance.post('/auth/login', {
      email: this.configService.shiprocketEmail,
      password: this.configService.shiprocketPassword,
    });

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
    const tokenEntity = await this.prismaService.shipRocketToken.findFirst({
      where: { expiresAt: { gt: new Date() } },
      orderBy: { expiresAt: 'desc' },
    });

    if (tokenEntity) {
      return tokenEntity.token;
    }

    return this.generateNewToken();
  }
}
