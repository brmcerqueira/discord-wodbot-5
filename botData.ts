import { RollResult } from "./diceRollManager.ts";
import { config } from "./config.ts";
import { MessageScope } from "./messageScope.ts";
import { Interaction, Message, TextChannel } from "./deps.ts";

export const lastRolls: {
    [userId: string]: {
        message: Message,
        result: RollResult
    }
} = {};

const scopeMessages: {
    [messageId: string]: MessageScope[]
} = {};

export function checkMessageScope(interaction: Interaction, scopes: MessageScope[]): boolean {
    for (const scope of scopes) {
        if ((scope == MessageScope.Storyteller && interaction.user.id != config.storytellerId)
            || (scope != MessageScope.Storyteller
                && (interaction.message && (!scopeMessages[interaction.message.id] || (scopeMessages[interaction.message.id]
                    && scopeMessages[interaction.message.id].indexOf(scope) == -1))))) {
            return false;
        }
    }
    return true;
}

export function addMessageScope(messageId: string, scopes: MessageScope[]): void {
    if (!scopeMessages[messageId]) {
        scopeMessages[messageId] = [];
    }
    scopes.forEach(s => scopeMessages[messageId].push(s));
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
