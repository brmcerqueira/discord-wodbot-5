import { log, sprintf } from "./deps.ts";

await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler("DEBUG", {
            formatter: rec => `[${rec.datetime.toISOString()}](${rec.levelName}) ${
                rec.args.length > 0 ? sprintf(rec.msg, ...rec.args): rec.msg}` 
        })
    },
    loggers: {
        default: {
            level: "DEBUG",
            handlers: ["console"],
        }
    },
});

export const logger = log.getLogger();