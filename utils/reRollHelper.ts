import { discord } from "../discord.ts";
import { format } from "./format.ts";
import { rollMessageEmbed } from "./rollMessageEmbed.ts";
import { reRoll } from "../diceRollManager.ts";
import { labels } from "../i18n/labels.ts";
import { TextChannel } from "katana/mod.ts";
import { bot } from "../bot.ts";

export function reRollHelper(channel: TextChannel, userId: string, dices: number) {
    let roll = bot.lastRolls[userId];
    if (roll) {
        delete bot.lastRolls[userId];
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