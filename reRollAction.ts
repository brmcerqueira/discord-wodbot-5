import { Logger } from "log4deno/index.ts";
import { Message } from "katana/mod.ts";
import { labels } from "./i18n/labels.ts";
import { reRoll } from "./dicePool.ts";
import { rollMessageEmbed } from "./rollMessageEmbed.ts";
import { reRollManager } from "./reRollManager.ts";

export function reRollAction(logger: Logger, message: Message, matchArray: RegExpMatchArray[]) {
    logger.info(message.content);

    for(let match of matchArray) {
        logger.info(match.groups);
        if (match.groups) {
            let result = reRollManager[message.user.id];
            if (result) {
                delete reRollManager[message.user.id];
                message.channel.send(rollMessageEmbed(reRoll(result, parseInt(match.groups.dices)), 
                message.user.id, labels.reRollActionText));
            }      
        }      
    }
}