import * as botData from "../botData.ts";
import { Embed, Interaction } from "../deps.ts";
import { labels } from "../i18n/labels.ts";

export async function setModifierSolver(_interaction: Interaction, modifier: number) {
    botData.setModifier(modifier);  
    await botData.outputChannel.send(new Embed({
        title: labels.storytellerChangeModifier,
        //Cinza
        color: 9807270,
        fields: [{
            name: labels.modifier,
            value: `**${botData.modifier}**`,
            inline: true
        }]
    }));
}