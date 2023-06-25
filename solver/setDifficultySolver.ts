import * as botData from "../botData.ts";
import { Embed, Interaction } from "../deps.ts";
import { labels } from "../i18n/labels.ts";
import * as colors from "../colors.ts";

export async function setDifficultySolver(_interaction: Interaction, difficulty: number) {
    botData.setDifficulty(difficulty);  
    await botData.outputChannel.send(new Embed({
        title: labels.storytellerChangeDifficulty,
        color: colors.Gray,
        fields: [{
            name: labels.difficulty,
            value: `**${botData.difficulty}**`,
            inline: true
        }]
    }));
}