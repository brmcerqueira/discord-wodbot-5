
import { logger } from "./logger.ts";
import { labels } from "./i18n/labels.ts";

export type ConfigDef = {
    discordToken: string,
    storytellerId: bigint,
    dicePoolsChannelId: bigint,
    storytellerChannelId: bigint,
    outputChannelId: bigint,
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

const path = Deno.env.get("DISCORD_WODBOT_CONFIG_PATH");

if (!path) {
    logger.info(labels.configNotFound);
}

export const config: ConfigDef = <ConfigDef> JSON.parse(await Deno.readTextFile(<string>path));