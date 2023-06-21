import * as botData from "../botData.ts";
import { config } from "../config.ts";
import { Embed, Interaction, base64 } from "../deps.ts";
import { labels } from "../i18n/labels.ts";

export async function characterButton(interaction: Interaction, value: {
    isChange: boolean,
    id: string,
}) {
    if (value.isChange) {
        await botData.setStorytellerCurrentCharacterId(value.id);
    }
    else {
        const user = await interaction.client.users.fetch(value.id);
        await user.send(new Embed({
            title: labels.openYourCharacter,
            description: `🔗 ${config.host}/?id=${base64.encode(user.id)}`,
            //Cinza
            color: 9807270
        }));
    }
}