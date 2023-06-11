import { reRoll } from "../diceRollManager.ts";
import { labels } from "../i18n/labels.ts";
import { format } from "../utils/format.ts";
import { botData } from "../botData.ts";
import { Bot, transformEmbed } from "../deps.ts";
import { MessageReaction } from "../messageReaction.ts";
import { rollEmbed } from "../utils/rollEmbed.ts";

export function reRollButton(bot: Bot, reaction: MessageReaction, value: number) {
    const roll = botData.lastRolls[reaction.userId.toString()];
    if (roll) {
        delete botData.lastRolls[reaction.userId.toString()];
        if ((roll.result.amount - roll.result.hunger) > 0) {
            bot.helpers.deleteAllReactions(reaction.channelId, roll.messageId).then(() => 
                bot.helpers.sendMessage(reaction.channelId, {
                    embeds: [transformEmbed(bot, 
                        rollEmbed(reRoll(roll.result, value), reaction.userId, 
                    format(labels.reRollHelperText, value)))]
            }));  
        }
    }
}