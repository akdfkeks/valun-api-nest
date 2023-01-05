import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';

const logDir = __dirname + '/../../logs'; // log 파일을 관리할 폴더

// RFC5424
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30, //30일치 로그파일 저장
    zippedArchive: false, // 로그가 쌓이면 압축하여 관리
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike('Valun', {
          colors: true,
          prettyPrint: true, // nest에서 제공하는 옵션. 로그 가독성을 높여줌
        }),
      ),
    }),

    // info, warn, error 로그는 파일로 관리
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
});
