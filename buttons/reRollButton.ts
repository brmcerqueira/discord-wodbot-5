import { reRoll } from "../diceRollManager.ts";
import { labels } from "../i18n/labels.ts";
import { botData } from "../botData.ts";
import { MessageReaction, User, sprintf } from "../deps.ts";
import { rollEmbed } from "../utils/rollEmbed.ts";

export async function reRollButton(reaction: MessageReaction, user: User, value: number) {
    const roll = botData.lastRolls[user.id];
    if (roll) {
        delete botData.lastRolls[user.id];
        if ((roll.result.amount - roll.result.hunger) > 0) {
            await reaction.client.rest.endpoints.deleteAllReactions(reaction.message.channelID, roll.messageId);
            await reaction.message.channel.send(rollEmbed(reRoll(roll.result, value), user.id, 
            sprintf(labels.reRollHelperText, value)));
        }
    }
}