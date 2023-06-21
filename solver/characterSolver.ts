import * as botData from "../botData.ts";
import { config } from "../config.ts";
import { ButtonStyle, Embed, Interaction, MessageComponentType, base64 } from "../deps.ts";
import { labels } from "../i18n/labels.ts";

export enum CharacterSolverValueType {
    Change,
    Unlock,
    Link,
}

export type CharacterSolverValue = {
    type: CharacterSolverValueType,
    id: string,
}

export async function characterSolver(interaction: Interaction, value: CharacterSolverValue) {
    switch (value.type) {
        case CharacterSolverValueType.Change:
            await botData.setStorytellerCurrentCharacterId(value.id);
            break;
        case CharacterSolverValueType.Unlock:
            if (botData.unlock.indexOf(value.id) == -1) {
                botData.unlock.push(value.id);
            }
            break;
        case CharacterSolverValueType.Link: {
            const user = await interaction.client.users.fetch(value.id);
            await user.send({
                    components: [{
                        type: MessageComponentType.ActionRow,
                        components: [{
                            type: MessageComponentType.Button,
                            label: labels.openYourCharacter,
                            style: ButtonStyle.LINK,
                            url: `${config.host}/?id=${base64.encode(value.id)}`
                        }]
                    }]
                });
            }
            break;
    }
}