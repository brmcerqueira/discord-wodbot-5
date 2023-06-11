import { botData } from "../botData.ts";
import { config } from "../config.ts";
import { Bot, transformEmbed } from "../deps.ts";
import { labels } from "../i18n/labels.ts";
import { MessageReaction } from "../messageReaction.ts";

export function setDifficultyButton(bot: Bot, reaction: MessageReaction, difficulty: number) {
    botData.difficulty = difficulty;  
    bot.helpers.sendMessage(config.outputChannelId, {
        embeds: [transformEmbed(bot, {
            title: labels.storytellerChangeDifficulty,
            //Cinza
            color: 9807270,
            fields: [{
                name: labels.difficulty,
                value: `**${botData.difficulty}**`,
                inline: true
            }]
        })]
    })
}