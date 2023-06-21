import { labels } from "./i18n/labels.ts";
import * as characterManager from "./characterManager.ts";
import { ButtonStyle, sprintf } from "./deps.ts";
import { Action, Button } from "./action.ts";
import { ChangeCharacter, ReloadCharacters, SetBonus, SetDifficulty, SetOnus, Storyteller, createScope } from "./scope.ts";
import { reloadCharactersSolver } from "./solver/reloadCharactersSolver.ts";
import { setDifficultySolver } from "./solver/setDifficultySolver.ts";
import { setModifierSolver } from "./solver/setModifierSolver.ts";
import { CharacterSolverValue, CharacterSolverValueType, characterSolver } from "./solver/characterSolver.ts";

const defaultActions: Action[] = [
    {
        message: `__**${labels.actions.reloadCharacters}**__`,
        buttons: [{
            style: ButtonStyle.SECONDARY,
            emoji: {
                name: '🔃'
            }
        }],
        scopes: [Storyteller, ReloadCharacters],
        solve: reloadCharactersSolver
    },
    {
        message: `__**${labels.actions.setDifficulty}**__`,
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
        solve: setDifficultySolver
    },
    {
        message: `__**${labels.actions.setBonus}**__`,
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
        solve: setModifierSolver
    },
    {
        message: `__**${labels.actions.setOnus}**__`,
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
        solve: setModifierSolver
    }
];

export function buildActions(): Action[] {
    const result: Action[] = [...defaultActions];

    for (const key in characterManager.characters) {
        const character = characterManager.characters[key];

        const buttons: Button[] = [{
            style: ButtonStyle.SECONDARY,
            emoji: {
                name: '🧛'
            },
            value: <CharacterSolverValue> {
                type:  CharacterSolverValueType.Change,
                id: key
            }
        }]

        const userId = characterManager.getUserIdByCharacterId(key);

        if (userId) {
            buttons.push({
                style: ButtonStyle.SUCCESS,
                emoji: {
                    name: '🔓'
                },
                value: <CharacterSolverValue> {
                    type:  CharacterSolverValueType.Unlock,
                    id: userId
                }
            },{
                style: ButtonStyle.PRIMARY,
                emoji: {
                    name: '🔗'
                },
                value: <CharacterSolverValue> {
                    type:  CharacterSolverValueType.Link,
                    id: userId
                }
            });
        }

        result.push({
            message: `__**${sprintf(labels.actions.characterManager, character.name)}**__`,
            buttons: buttons,
            scopes: [Storyteller, ChangeCharacter, createScope()],
            solve: characterSolver
        });
    }

    return result;
}