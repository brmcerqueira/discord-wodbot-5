import { RollResult } from "./diceRollManager.ts";
import { config } from "./config.ts";
import { MessageScope } from "./messageScope.ts";
import { Embed, TextChannel, User } from "./deps.ts";

export type CustomId = { index: number, scopes?: MessageScope[] };

export const lastRolls: {
    [userId: string]: {
        embed: Embed,
        result: RollResult
    }
} = {};

export function checkMessageScope(user: User, customId: CustomId, scopes: MessageScope[]): boolean {
    if (scopes.length > 0) {
        for (const scope of scopes) {
            if ((scope == MessageScope.Storyteller && user.id != config.storytellerId)
                || (scope != MessageScope.Storyteller
                    && (!customId.scopes || customId.scopes.indexOf(scope) == -1))) {
                return false;
            }
        }
    }

    return true;
}

export let outputChannel: TextChannel;

export function setOutputChannel(value: TextChannel) {
    outputChannel = value;
}

export let difficulty: number | null = null;

export function setDifficulty(value: number | null) {
    difficulty = value;
}

export let storytellerSpreadSheetId: string =
    config.storytellerCharacters.length > 0 ? config.storytellerCharacters[0] : "";

export function setStorytellerSpreadSheetId(value: string) {
    storytellerSpreadSheetId = value;
}

export function parseCustomId(id: string): CustomId {
    const split = id.split('_', 2);

    if (split.length == 0) {
        const bit = parseInt(split[0]);
    
        return { 
            index: parseInt(split[1]),
            scopes: Object.keys(MessageScope)
            .map(Number).filter(value => (bit & value) === value)
        };
    }

    return { 
        index: parseInt(id) 
    };
}

export function buildId(index: number, ...scopes: MessageScope[]): string {
    return scopes.length > 0 ? `${scopes.reduce((total, current) => total + current, 0)}_${index}` : index.toString();
}