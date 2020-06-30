import { labels } from "../i18n/labels.ts";
import { reRoll } from "../dicePool.ts";
import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { rollMessageEmbed } from "../rollMessageEmbed.ts";
import { rollManager } from "../rollManager.ts";

export function reRollButton(reaction: MessageReaction, isAdd: boolean, value: number) {
    reaction.users.forEach(user => {
        let result = rollManager[user.id];
        if (result) {
            delete rollManager[user.id];
            reaction.message.channel.send(rollMessageEmbed(reRoll(result, value), 
            user.id, labels.reRollActionText));
        }  
    });
}