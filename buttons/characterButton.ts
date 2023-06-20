import * as botData from "../botData.ts";
import { Interaction } from "../deps.ts";

export async function characterButton(interaction: Interaction, value: {
    isChange: boolean,
    id: string,
}) {
    if (value.isChange) {
        await botData.setStorytellerCurrentCharacterId(value.id);
    }
    else {
        await botData.sendCharacterLink(await interaction.client.users.fetch(value.id));
    }
}