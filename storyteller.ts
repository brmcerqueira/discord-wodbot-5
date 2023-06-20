import { labels } from "./i18n/labels.ts";
import { setDifficultyButton } from "./buttons/setDifficultyButton.ts";
import { reloadCharactersButton } from "./buttons/reloadCharactersButton.ts";
import * as characterManager from "./characterManager.ts";
import { ButtonStyle, sprintf } from "./deps.ts";
import { Button, ChangeCharacter, Command, ReloadCharacters, SetBonus, SetDifficulty, SetOnus, Storyteller, createCommandScope } from "./command.ts";
import { characterButton } from "./buttons/characterButton.ts";
import { setModifierButton } from "./buttons/setModifierButton.ts";

const defaultCommands: Command[] = [
    {
        message: `__**${labels.commands.reloadCharacters}**__`,
        buttons: [{
            style: ButtonStyle.SECONDARY,
            emoji: {
                name: '🔃'
            }
        }],
        scopes: [Storyteller, ReloadCharacters],
        action: reloadCharactersButton
    },
    {
        message: `__**${labels.commands.setDifficulty}**__`,
        buttons: [
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '1️⃣'
                },
                value: 1
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '2️⃣'
                },
                value: 2
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '3️⃣'
                },
                value: 3
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '4️⃣'
                },
                value: 4
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '5️⃣'
                },
                value: 5
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '6️⃣'
                },
                value: 6
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '7️⃣'
                },
                value: 7
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '8️⃣'
                },
                value: 8
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '9️⃣'
                },
                value: 9
            }],
        scopes: [Storyteller, SetDifficulty],
        action: setDifficultyButton
    },
    {
        message: `__**${labels.commands.setBonus}**__`,
        buttons: [
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '1️⃣'
                },
                value: 1
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '2️⃣'
                },
                value: 2
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '3️⃣'
                },
                value: 3
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '4️⃣'
                },
                value: 4
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '5️⃣'
                },
                value: 5
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '6️⃣'
                },
                value: 6
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '7️⃣'
                },
                value: 7
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '8️⃣'
                },
                value: 8
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '9️⃣'
                },
                value: 9
            }],
        scopes: [Storyteller, SetBonus],
        action: setModifierButton
    },
    {
        message: `__**${labels.commands.setOnus}**__`,
        buttons: [
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '1️⃣'
                },
                value: -1
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '2️⃣'
                },
                value: -2
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '3️⃣'
                },
                value: -3
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '4️⃣'
                },
                value: -4
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '5️⃣'
                },
                value: -5
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '6️⃣'
                },
                value: -6
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '7️⃣'
                },
                value: -7
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '8️⃣'
                },
                value: -8
            },
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '9️⃣'
                },
                value: -9
            }],
        scopes: [Storyteller, SetOnus],
        action: setModifierButton
    }
];

export function buildCommands(): Command[] {
    const result: Command[] = [];

    for (const command of defaultCommands) {
        result.push(command);
    }

    for (const key in characterManager.characters) {
        const character = characterManager.characters[key];

        const buttons: Button[] = [{
            style: ButtonStyle.SECONDARY,
            emoji: {
                name: '🧛'
            },
            value: {isChange: true, id: key}
        }]

        const userId = characterManager.getUserIdByCharacterId(key);

        if (userId) {
            buttons.push({
                style: ButtonStyle.SUCCESS,
                emoji: {
                    name: '🔗'
                },
                value: {isChange: false, id: userId}
            });
        }

        result.push({
            message: `__**${sprintf(labels.commands.characterManager, character.name)}**__`,
            buttons: buttons,
            scopes: [Storyteller, ChangeCharacter, createCommandScope()],
            action: characterButton
        });
    }

    return result;
}