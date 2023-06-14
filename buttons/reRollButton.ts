import { reRoll } from "../diceRollManager.ts";
import { labels } from "../i18n/labels.ts";
import * as botData from "../botData.ts";
import { Interaction, InteractionMessageComponentData, sprintf } from "../deps.ts";
import { rollEmbed } from "../utils/rollEmbed.ts";

export async function reRollButton(interaction: Interaction, value: InteractionMessageComponentData) {
    const roll = botData.lastRolls[interaction.user.id];
    if (roll) {
        delete botData.lastRolls[interaction.user.id];
        if ((roll.result.amount - roll.result.hunger) > 0) {
            await interaction.editMessage(roll.message, {
                embeds: roll.message.embeds
            });
            await interaction.message!.channel.send(rollEmbed(reRoll(roll.result, parseInt(value.custom_id)), 
            interaction.user.id, sprintf(labels.reRollHelperText, value)));
        }
    }
}