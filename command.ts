import { MessageEmbed } from "katana/mod.ts";
import { MessageScope } from "./messageScope.ts";
import { labels } from "./i18n/labels.ts";
import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { setDifficultyButton } from "./buttons/setDifficultyButton.ts";
import { reloadCharactersButton } from "./buttons/reloadCharactersButton.ts";

export interface Command {
    message: string | MessageEmbed,
    reactions: string[] | { [key: string]: any },
    scopes?: MessageScope[]
}

export interface CommandAction extends Command {
    button: (reaction: MessageReaction, value: any, scopes?: MessageScope[]) => void,
}

export const commands: CommandAction[] = [
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
        message: `__**${labels.commands.reloadCharacters}**__`,
        reactions: ['🔃'],
        scopes: [MessageScope.Storyteller, MessageScope.ReloadCharacters],
        button: reloadCharactersButton
    }
]