import { Logger } from "log4deno/index.ts";
import { Message } from "katana/mod.ts";
import { roll } from "../dicePool.ts";
import { rollMessageEmbed } from "../rollMessageEmbed.ts";
import { rollManager, difficulty } from "../rollManager.ts";
import { ConfigDef } from "../configDef.ts";

export function dicePoolAction(logger: Logger, config: ConfigDef, message: Message, matchArray: RegExpMatchArray[]) {
    for(let match of matchArray) {
        if (match.groups) {
            let dif = 1;

            if (difficulty.current) {
                dif = difficulty.current;
                difficulty.current = null;
            }
            else if (match.groups.difficulty) {
                dif = parseInt(match.groups.difficulty);
            }

            let result = roll(parseInt(match.groups.dices), 
            match.groups.hunger ? parseInt(match.groups.hunger) : 0, dif);

            rollManager[message.user.id] = result;

            message.channel.send(rollMessageEmbed(result, message.user.id, match.groups.description));
        }      
    }
}