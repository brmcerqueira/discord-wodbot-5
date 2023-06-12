import { reRoll } from "../diceRollManager.ts";
import { labels } from "../i18n/labels.ts";
import { format } from "../utils/format.ts";
import { botData } from "../botData.ts";
import { MessageReaction } from "../deps.ts";
import { rollEmbed } from "../utils/rollEmbed.ts";

export async function reRollButton(reaction: MessageReaction, value: number) {
    for (const user of await reaction.users.collection()) {
        const userId = user[0];
        const roll = botData.lastRolls[userId];
        if (roll) {
            delete botData.lastRolls[userId];
            if ((roll.result.amount - roll.result.hunger) > 0) {
                await reaction.client.rest.endpoints.deleteAllReactions(reaction.message.channelID, roll.messageId);
                await reaction.message.channel.send({
                    embeds: [rollEmbed(reRoll(roll.result, value), userId, 
                    format(labels.reRollHelperText, value))]
            });
            }
        }
    }
}