import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { bot } from "../bot.ts";
import { discord } from "../discord.ts";
import { rollMessageEmbed } from "../utils/rollMessageEmbed.ts";
import { reRoll } from "../diceRollManager.ts";
import { labels } from "../i18n/labels.ts";
import { format } from "../utils/format.ts";

export function reRollButton(reaction: MessageReaction, value: number) {
    reaction.users.forEach(user => {       
        let roll = bot.lastRolls[user.id];
        if (roll) {
            delete bot.lastRolls[user.id];
            if ((roll.result.amount - roll.result.hunger) > 0) {
                discord.deleteAllReactions(reaction.message.channel.id, roll.messageId)
                .then(ok => {
                    if (ok) {
                        reaction.message.channel.send(rollMessageEmbed(
                            reRoll(roll.result, value), user.id, 
                        format(labels.reRollHelperText, value)));
                    } 
                });  
            }
        }
    });
}