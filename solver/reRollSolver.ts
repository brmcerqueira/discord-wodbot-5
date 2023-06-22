import { reRoll } from "../diceRollManager.ts";
import { labels } from "../i18n/labels.ts";
import * as botData from "../botData.ts";
import { Interaction, InteractionResponseType, sprintf } from "../deps.ts";
import { CustomId } from "../scope.ts";
import { buildRollMessage } from "../utils/buildRollMessage.ts";

export async function reRollSolver(interaction: Interaction, customId: CustomId) {
    const roll = botData.lastRolls[interaction.user.id];
    if (roll) {
        delete botData.lastRolls[interaction.user.id];
        if ((roll.result.amount - roll.result.hunger) > 0) {
            await interaction.respond({
                type: InteractionResponseType.UPDATE_MESSAGE,
                embeds: [roll.embed],
                components: []
            });

            const message = buildRollMessage(reRoll(roll.result, customId.index), interaction.guild!.id, 
                interaction.user.id, sprintf(labels.reRollHelperText, customId.index));

            await interaction.message!.channel.send({
                content: message.content,
                embeds: [message.embed]
            });
        }
    }
}