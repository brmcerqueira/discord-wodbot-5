import { log } from "./deps.ts";
import { format } from "./utils/format.ts";

await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler("DEBUG", {
            formatter: rec => `[${rec.datetime.toISOString()}](${rec.levelName}) ${format(rec.msg, rec.args)}` 
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