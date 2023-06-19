
import { logger } from "./logger.ts";
import { labels } from "./i18n/labels.ts";

export type ConfigDef = {
    discordToken: string,
    storytellerId: string,
    dicePoolsChannelId: string,
    storytellerChannelId: string,
    outputChannelId: string
}

const path = Deno.args.length > 0 ? Deno.args[0] : Deno.env.get("WODBOT_CRONICLE_PATH");

if (!path) {
    logger.info(labels.configNotFound);
}
else {
    logger.info(path);
}

export const config: ConfigDef = <ConfigDef> JSON.parse(await Deno.readTextFile(`${path}/config.json`));

export const charactersPath = `${path}/characters/`;
export const outPath = `${path}/out/`;