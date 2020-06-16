import { Logger } from "log4deno/index.ts";
import { Message } from "katana/mod.ts";
import { roll } from "./dicePool.ts";
import { rollMessageEmbed } from "./rollMessageEmbed.ts";
import { reRollManager } from "./reRollManager.ts";

export function dicePoolAction(logger: Logger, message: Message, matchArray: RegExpMatchArray[]) {
    logger.info(message.content);

    for(let match of matchArray) {
        logger.info(match.groups);
        if (match.groups) {
            let result = roll(parseInt(match.groups.dices), 
            match.groups.hunger ? parseInt(match.groups.hunger) : 0, 
            match.groups.difficulty ? parseInt(match.groups.difficulty) : 1);

            reRollManager[message.user.id] = result;

            message.channel.send(rollMessageEmbed(result, message.user.id, match.groups.description));
        }      
    }
}