import { reRoll } from "../diceRollManager.ts";
import { labels } from "../i18n/labels.ts";
import * as botData from "../botData.ts";
import { Interaction, InteractionResponseType, sprintf } from "../deps.ts";
import { rollEmbed } from "../utils/rollEmbed.ts";
import { CustomId } from "../botData.ts";

export async function reRollButton(interaction: Interaction, customId: CustomId) {
    const roll = botData.lastRolls[interaction.user.id];
    if (roll) {
        delete botData.lastRolls[interaction.user.id];
        if ((roll.result.amount - roll.result.hunger) > 0) {
            await interaction.respond({
                type: InteractionResponseType.UPDATE_MESSAGE,
                embeds: [roll.embed],
                components: []
            });
            await interaction.message!.channel.send(rollEmbed(reRoll(roll.result, customId.index), 
            interaction.user.id, sprintf(labels.reRollHelperText, customId.index)));
        }
    }
}