
import { logger } from "./logger.ts";
import { labels } from "./i18n/labels.ts";

export type ConfigDef = {
    discordToken: string,
    storytellerId: string,
    dicePoolsChannelId: string,
    storytellerChannelId: string,
    outputChannelId: string
}

const path = Deno.env.get("DISCORD_WODBOT_CONFIG_PATH");

if (!path) {
    logger.info(labels.configNotFound);
}
else {
    logger.info(path);
}

export const config: ConfigDef = <ConfigDef> JSON.parse(await Deno.readTextFile(<string>path));