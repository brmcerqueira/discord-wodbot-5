import { MessageEmbed } from "katana/mod.ts";
import { RollResult, RollStatus } from "../diceRollManager.ts";
import { labels } from "../i18n/labels.ts";

export function rollMessageEmbed(result: RollResult, userId: string, title?: string): MessageEmbed {
    const embed = new MessageEmbed();

    if (title) {
        embed.setTitle(title);
    }
    
    embed.setDescription(result.dices.map(d => d.isHunger ? `__**${d.value}**__` : d.value).join(' - '));

    let statusLabel: string = "";

    switch (result.status) {
        case RollStatus.BestialFailure:
            statusLabel = labels.bestialFailure;
            //Vermelho
            embed.setColor(15158332);
            break;                
        case RollStatus.Failure:
            statusLabel = labels.failure;
            //Laranja
            embed.setColor(15105570);
            break;
        case RollStatus.Success:
            statusLabel = labels.success;
            //Verde
            embed.setColor(3066993);
            break;
        case RollStatus.RegularCritical:
            statusLabel = labels.regularCritical;
            //Azul
            embed.setColor(3447003);
            break;
        case RollStatus.MessyCritical:
            statusLabel = labels.messyCritical;
            //Roxo
            embed.setColor(10181046);
            break;            
    }

    return embed.addField(labels.dices, 
        result.hunger > 0 ? `${result.amount} / ${result.hunger}` : result.amount.toString(), true)
    .addField(labels.difficulty, result.difficulty.toString(), true)
    .addField(labels.successes, result.successes.toString(), true)
    .addField(labels.status, `**${statusLabel}**`, true)
    .addField(labels.player, `<@${userId}>`, true);
}