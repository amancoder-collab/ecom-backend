import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_HOSTNAME: Joi.string().required(),
  ACCESS_TOKEN_COOKIE_NAME: Joi.string().default('access_token'),
  REFRESH_TOKEN_COOKIE_NAME: Joi.string().default('refresh_token'),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string().required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().required(),
});

export default registerAs('app', () => {
  const config = {
    port: parseInt(process.env.PORT, 10),
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpPort: parseInt(process.env.SMTP_PORT, 10),
    smtpHostname: process.env.SMTP_HOSTNAME,
    accessTokenCookieName: process.env.ACCESS_TOKEN_COOKIE_NAME,
    refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisPassword: process.env.REDIS_PASSWORD,
  };

  const { error } = configValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (error) {
    throw new Error(`Configuration validation error: ${error.message}`);
  }

  return config;
});
