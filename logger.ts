import { Logger } from "log4deno/index.ts";

export const logger = new Logger({
    default: {
        types: ['console'],
        logLevel: ['INFO'],
        logFormat: '[$date] [$level] [$name]',
        dateFormat: 'yyyy-MM-dd HH:mm:ss',
    }
});