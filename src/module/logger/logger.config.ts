import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import * as winston from "winston";
import "winston-daily-rotate-file";

export const winstonConfig = {
  transports: [
    // Console Transport
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike("Nest", {
          prettyPrint: true,
          appName: true,
          processId: true,
          colors: true,
        }),
      ),
    }),

    // Rotating File Transport for Errors
    new winston.transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    // Rotating File Transport for All Logs
    new winston.transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
