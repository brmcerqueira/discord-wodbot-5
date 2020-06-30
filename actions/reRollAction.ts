import { Message } from "katana/mod.ts";
import { labels } from "../i18n/labels.ts";
import { reRoll } from "../dicePool.ts";
import { rollMessageEmbed } from "../rollMessageEmbed.ts";
import { rollManager } from "../rollManager.ts";

export function reRollAction(message: Message, matchArray: RegExpMatchArray[]) {
    for(let match of matchArray) {
        if (match.groups) {
            let result = rollManager[message.user.id];
            if (result) {
                delete rollManager[message.user.id];
                message.channel.send(rollMessageEmbed(reRoll(result, parseInt(match.groups.dices)), 
                message.user.id, labels.reRollActionText));
            }      
        }      
    }
}