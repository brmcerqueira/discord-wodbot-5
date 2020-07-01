import { RollResult, reRoll } from "./dicePool.ts";
import { rollMessageEmbed } from "./rollMessageEmbed.ts";
import { labels } from "./i18n/labels.ts";
import { TextChannel } from "katana/mod.ts";
import { format } from "./format.ts";
import { discord } from "./discord.ts";

export type RollManager = {
    [userId: string]: {
        messageId: string,
        result: RollResult
    }
}

export const rollManager: RollManager = {};

export const difficulty: { current: number | null } = { current: null };

export function reRollHelper(channel: TextChannel, userId: string, dices: number) {
    let roll = rollManager[userId];
    if (roll) {
        delete rollManager[userId];
        if ((roll.result.amount - roll.result.hunger) > 0) {
            discord.deleteAllReactions(channel.id, roll.messageId).then((mustSend: boolean) => {
                if (mustSend) {
                    channel.send(rollMessageEmbed(reRoll(roll.result, dices), userId, 
                    format(labels.reRollHelperText, dices)));
                } 
            });  
        }
    }
}