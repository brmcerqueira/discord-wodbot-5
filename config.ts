import { Config } from "config/mod.ts";
import { logger } from "./logger.ts";
import { labels } from "./i18n/labels.ts";

export type ConfigDef = {
    discordToken: string,
    storytellerId: string,
    dicePoolsChannelId: string,
    storytellerChannelId: string,
    outputChannelId: string,
    characterLoadInterval: number,
    googleSheets: {
        clientId: string,
        clientSecret: string,
        apiKey: string
    },
    playerCharacters: { 
        [key: string]: string
    },
    storytellerCharacters: string[]
}

export const config: ConfigDef = <ConfigDef> await Config.load({
    file: 'default'
});

if (!config) {
    logger.info(labels.configNotFound);
}