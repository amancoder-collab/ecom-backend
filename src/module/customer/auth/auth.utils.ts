import { Response } from 'express';
import { ITokens } from './interfaces/tokens';
import { AppConfigService } from 'src/lib/config/config.service';

export const setTokenCookie = (
  res: Response,
  tokens: ITokens,
  configService: AppConfigService,
) => {
  res.cookie(configService.accessTokenCookieName, tokens.accessToken, {
    httpOnly: true,
    secure: configService.isDevelopment === false,
  });
  res.cookie(configService.refreshTokenCookieName, tokens.refreshToken, {
    httpOnly: true,
    secure: configService.isDevelopment === false,
  });
};

export const clearTokenCookie = (
  res: Response,
  configService: AppConfigService,
) => {
  res.clearCookie(configService.accessTokenCookieName);
  res.clearCookie(configService.refreshTokenCookieName);
};
