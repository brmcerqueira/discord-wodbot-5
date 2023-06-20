import { RollResult, RollStatus } from "../diceRollManager.ts";
import { labels } from "../i18n/labels.ts";
import { Embed, EmbedPayload } from "../deps.ts";

export function rollEmbed(result: RollResult, authorId: string, title?: string): Embed {
    const embed: EmbedPayload = {};

    if (title) {
        embed.title = title;
    }
    
    embed.description = result.dices.map(d => d.isHunger ? `__**${d.value}**__` : d.value).join(' - ');

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

    return new Embed(embed);
}