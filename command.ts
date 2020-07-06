import { MessageEmbed } from "katana/mod.ts";
import { MessageScope } from "./messageScope.ts";
import { labels } from "./i18n/labels.ts";
import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { setDifficultyButton } from "./buttons/setDifficultyButton.ts";
import { reloadCharactersButton } from "./buttons/reloadCharactersButton.ts";
import { characterManager } from "./characterManager.ts";
import { format } from "./utils/format.ts";
import { changeCharacterButton } from "./buttons/changeCharacterButton.ts";
import { addExperienceButton } from "./buttons/addExperienceButton.ts";
import { decreaseExperienceButton } from "./buttons/decreaseExperienceButton.ts";

export interface Command {
    message: string | MessageEmbed,
    reactions: string[] | { [key: string]: any },
    scopes?: MessageScope[]
}

export interface CommandAction extends Command {
    button: (reaction: MessageReaction, value: any, scopes?: MessageScope[]) => void,
}

const defaultCommands: CommandAction[] = [
    {
        message: `__**${labels.commands.reloadCharacters}**__`,
        reactions: ['🔃'],
        scopes: [MessageScope.Storyteller, MessageScope.ReloadCharacters],
        button: reloadCharactersButton
    },
    {
        message: `__**${labels.commands.setDifficulty}**__`,
        reactions: {
            '1️⃣': 1, 
            '2️⃣': 2, 
            '3️⃣': 3, 
            '4️⃣': 4, 
            '5️⃣': 5, 
            '6️⃣': 6, 
            '7️⃣': 7, 
            '8️⃣': 8, 
            '9️⃣': 9
        },
        scopes: [MessageScope.Storyteller, MessageScope.SetDifficulty],
        button: setDifficultyButton
    },
    {
        message: `__**${labels.addExperience}**__`,
        reactions: {
            '1️⃣': 1, 
            '2️⃣': 2, 
            '3️⃣': 3, 
            '4️⃣': 4, 
            '5️⃣': 5, 
            '6️⃣': 6, 
            '7️⃣': 7, 
            '8️⃣': 8, 
            '9️⃣': 9
        },
        scopes: [MessageScope.Storyteller, MessageScope.AddExperience],
        button: addExperienceButton
    },
    {
        message: `__**${labels.decreaseExperience}**__`,
        reactions: {
            '1️⃣': 1, 
            '2️⃣': 2, 
            '3️⃣': 3, 
            '4️⃣': 4, 
            '5️⃣': 5, 
            '6️⃣': 6, 
            '7️⃣': 7, 
            '8️⃣': 8, 
            '9️⃣': 9
        },
        scopes: [MessageScope.Storyteller, MessageScope.DecreaseExperience],
        button: decreaseExperienceButton
    }
];

export function buildCommands(): CommandAction[] {
    const result: CommandAction[] = [];

    for (const command of defaultCommands) {
        result.push(command);
    }
    
    for (const key in characterManager.characters) {
        const character = characterManager.characters[key];
        result.push({
            message: `__**${format(labels.changeCharacterOption, character.name)}**__`,
            reactions: {
                '🧛': key
            },
            scopes: [MessageScope.Storyteller, MessageScope.ChangeCharacter],
            button: changeCharacterButton
        });
    }

    return result;
}