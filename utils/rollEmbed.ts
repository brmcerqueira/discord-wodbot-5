import { RollResult, RollStatus } from "../diceRollManager.ts";
import { labels } from "../i18n/labels.ts";
import { EmbedPayload, EmojiPayload } from "../deps.ts";
import * as botData from "../botData.ts";

export function rollEmbed(result: RollResult, guildId: string, authorId: string, title?: string): EmbedPayload {
    const embed: EmbedPayload = {};

    if (title) {
        embed.title = title;
    }
    
    embed.description = result.dices.map(d => {
        if (d.isHunger) {
            if (d.value == 1) {
                return printEmoji(botData.emojis.bestial[guildId]);
            } 
            else if (d.value == 10) {
                return printEmoji(botData.emojis.messy[guildId]);
            } 
            else {
                return `__**${d.value}**__`
            }
        }
        else {
            return d.value;
        }
    }).join(' ');

    let statusLabel = "";

    switch (result.status) {
        case RollStatus.BestialFailure:
            statusLabel = labels.bestialFailure;
            //Vermelho
            embed.color = 15158332;
            break;                
        case RollStatus.Failure:
            statusLabel = labels.failure;
            //Laranja
            embed.color = 15105570;
            break;
        case RollStatus.Success:
            statusLabel = labels.success;
            //Verde
            embed.color = 3066993;
            break;
        case RollStatus.RegularCritical:
            statusLabel = labels.regularCritical;
            //Azul
            embed.color = 3447003;
            break;
        case RollStatus.MessyCritical:
            statusLabel = labels.messyCritical;
            //Roxo
            embed.color = 10181046;
            break;            
    }

    embed.fields = [{
        name: labels.dices,
        value: result.hunger > 0 ? `${result.amount} / ${result.hunger}` : result.amount.toString(),
        inline: true
    },{
        name: labels.difficulty,
        value: result.difficulty.toString(),
        inline: true
    },{
        name: labels.successes,
        value: result.successes.toString(),
        inline: true
    },{
        name: labels.status,
        value: `**${statusLabel}**`,
        inline: true
    },{
        name: labels.player,
        value: `<@${authorId}>`,
        inline: true
    }];

    if (result.modifier != 0) {
        embed.fields.splice(2, 0, {
            name: labels.modifier,
            value: result.modifier.toString(),
            inline: true
        });
    }

    return embed;
}

function printEmoji(emoji: EmojiPayload): string {
    return `<:${emoji.name}:${emoji.id}>`;
}