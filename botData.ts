// deno-lint-ignore-file
import { RollResult } from "./diceRollManager.ts";
import { config } from "./config.ts";
import { MessageScope } from "./messageScope.ts";
import { MessageReaction, TextChannel, User } from "./deps.ts";

export module botData {
    export const lastRolls: {
        [userId: string]: {
            messageId: string,
            result: RollResult
        }
    } = {};

    const scopeMessages: {
        [messageId: string]: MessageScope[]
    } = {};

    export function checkMessageScope(reaction: MessageReaction, user: User, isAdd: boolean, scopes: MessageScope[]): boolean {
        for (const scope of scopes) {
            if ((scope == MessageScope.AddEvent && !isAdd)
            || (scope == MessageScope.RemoveEvent && isAdd)
            || (scope == MessageScope.Storyteller && user.id != config.storytellerId)
            || ((scope != MessageScope.AddEvent 
                && scope != MessageScope.RemoveEvent 
                && scope != MessageScope.Storyteller) 
                && (!scopeMessages[reaction.message.id] || (scopeMessages[reaction.message.id] 
                && scopeMessages[reaction.message.id].indexOf(scope) == -1)))) {
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

    export let difficulty: number | null = null;

    export let storytellerSpreadSheetId: string = 
        config.storytellerCharacters.length > 0 ? config.storytellerCharacters[0] : "";
}