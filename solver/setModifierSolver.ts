import * as botData from "../botData.ts";
import { Embed, Interaction } from "../deps.ts";
import { labels } from "../i18n/labels.ts";
import * as colors from "../colors.ts";

export async function setModifierSolver(_interaction: Interaction, modifier: number) {
    botData.setModifier(modifier);  
    await botData.outputChannel.send(new Embed({
        title: labels.storytellerChangeModifier,
        color: colors.Gray,
        fields: [{
            name: labels.modifier,
            value: `**${botData.modifier}**`,
            inline: true
        }]
    }));
}