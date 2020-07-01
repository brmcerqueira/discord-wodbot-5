import { Config } from "config/mod.ts";
import { logger } from "./logger.ts";
import { labels } from "./i18n/labels.ts";

export type ConfigDef = {
    discordToken: string,
    storytellerId: string,
    googleSheets: {
        clientId: string,
        clientSecret: string,
        apiKey: string
    },
    dicePools: { 
        viewChannelId: string,
        outputChannelId: string
    },
    characters: { 
        [key: string]: string[]
    } 
}

export const config: ConfigDef = <ConfigDef> await Config.load({
    file: 'default'
});

if (!config) {
    logger.info(labels.configNotFound);
}