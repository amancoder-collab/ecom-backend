import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from "nest-winston";
import * as winston from "winston";

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: "DD/MM/YYYY, h:mm:ss a",
        }),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike("Nest", {
          prettyPrint: true,
          appName: true,
          processId: true,
          colors: true,
        }),
      ),
    }),
  ],
};
