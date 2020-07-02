import { RollResult } from "./diceRollManager.ts";
import { TextChannel } from "katana/mod.ts";
import { config } from "./config.ts";
import { MessageScope } from "./messageScope.ts";
import { MessageReaction } from "katana/src/models/MessageReaction.ts";

export module bot {
    export const lastRolls: {
        [userId: string]: {
            messageId: string,
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
            || (scope == MessageScope.Storyteller && !reaction.users.get(config.storytellerId))
            || (scopeMessages[reaction.message.id] 
                && scopeMessages[reaction.message.id].indexOf(scope) == -1)) {
                return false;
            }          
        }
        return true;
    }

    export function addMessageScope(messageId: string, ...args: MessageScope[]): void {
        if (!scopeMessages[messageId]) {
            scopeMessages[messageId] = [];
        }
        args.forEach(s => scopeMessages[messageId].push(s));
    }

    export let difficulty: number | null = null;

    export let dicePoolsChannel: TextChannel;
    export let storytellerChannel: TextChannel;
    export let outputChannel: TextChannel; 

    export let storytellerSpreadSheetId: string | null = 
        config.storytellerCharacters.length > 0 ? config.storytellerCharacters[0] : null;
}