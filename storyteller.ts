import { labels } from "./i18n/labels.ts";
import { setDifficultyButton } from "./buttons/setDifficultyButton.ts";
import { reloadCharactersButton } from "./buttons/reloadCharactersButton.ts";
import * as characterManager from "./characterManager.ts";
import { changeCharacterButton } from "./buttons/changeCharacterButton.ts";
import { addExperienceButton } from "./buttons/addExperienceButton.ts";
import { decreaseExperienceButton } from "./buttons/decreaseExperienceButton.ts";
import { ButtonStyle, sprintf } from "./deps.ts";
import { setHungerButton } from "./buttons/setHungerButton.ts";
import { AddExperience, ChangeCharacter, Command, DecreaseExperience, ReloadCharacters, SetDifficulty, SetHunger, Storyteller, createCommandScope } from "./command.ts";

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
        message: `__**${labels.commands.addExperience}**__`,
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
        scopes: [Storyteller, AddExperience],
        action: addExperienceButton
    },
    {
        message: `__**${labels.commands.decreaseExperience}**__`,
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
        scopes: [Storyteller, DecreaseExperience],
        action: decreaseExperienceButton
    },
    {
        message: `__**${labels.commands.setHunger}**__`,
        buttons: [
            {
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '0️⃣'
                },
                value: 0
            },
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
            }],
        scopes: [Storyteller, SetHunger],
        action: setHungerButton
    }
];

export function buildCommands(): Command[] {
    const result: Command[] = [];

    for (const command of defaultCommands) {
        result.push(command);
    }

    for (const key in characterManager.characters) {
        const character = characterManager.characters[key];
        result.push({
            message: `__**${sprintf(labels.commands.changeCharacterOption, character.name)}**__`,
            buttons: [{
                style: ButtonStyle.SECONDARY,
                emoji: {
                    name: '🧛'
                },
                value: key
            }],
            scopes: [Storyteller, ChangeCharacter, createCommandScope()],
            action: changeCharacterButton
        });
    }

    return result;
}