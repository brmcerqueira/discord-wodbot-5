// deno-lint-ignore-file
import { RollResult } from "./diceRollManager.ts";
import { config } from "./config.ts";
import { MessageScope } from "./messageScope.ts";
import { Channel } from "./deps.ts";
import { MessageReaction } from "./messageReaction.ts";

export module botData {
    export const lastRolls: {
        [userId: string]: {
            messageId: bigint,
            result: RollResult
        }
    } = {};

    const scopeMessages: {
        [messageId: string]: MessageScope[]
    } = {};

    export function checkMessageScope(reaction: MessageReaction, isAdd: boolean, scopes: MessageScope[]): boolean {
        for (const scope of scopes) {
            if ((scope == MessageScope.AddEvent && !isAdd)
            || (scope == MessageScope.RemoveEvent && isAdd)
            || (scope == MessageScope.Storyteller && reaction.userId != config.storytellerId)
            || ((scope != MessageScope.AddEvent 
                && scope != MessageScope.RemoveEvent 
                && scope != MessageScope.Storyteller) 
                && (!scopeMessages[reaction.messageId.toString()] || (scopeMessages[reaction.messageId.toString()] 
                && scopeMessages[reaction.messageId.toString()].indexOf(scope) == -1)))) {
                return false;
            }          
        }
        return true;
    }

    export function addMessageScope(messageId: bigint, scopes: MessageScope[]): void {
        if (!scopeMessages[messageId.toString()]) {
            scopeMessages[messageId.toString()] = [];
        }
        scopes.forEach(s => scopeMessages[messageId.toString()].push(s));
    }

    export let difficulty: number | null = null;

    export let storytellerSpreadSheetId: string = 
        config.storytellerCharacters.length > 0 ? config.storytellerCharacters[0] : "";
}