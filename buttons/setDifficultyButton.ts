import { botData } from "../botData.ts";
import { Embed, MessageReaction } from "../deps.ts";
import { labels } from "../i18n/labels.ts";

export async function setDifficultyButton(reaction: MessageReaction, difficulty: number) {
    botData.difficulty = difficulty;  
    await botData.outputChannel.send({
        embeds: [new Embed({
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