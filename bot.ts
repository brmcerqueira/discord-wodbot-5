import { RollResult } from "./diceRollManager.ts";
import { TextChannel } from "katana/mod.ts";

export module bot {
    export type LastRolls = {
        [userId: string]: {
            messageId: string,
            result: RollResult
        }
    }
    
    export const lastRolls: LastRolls = {};   
    export let difficulty: number | null = null;

    export let dicePoolsChannel: TextChannel;
    export let storytellerChannel: TextChannel;
    export let outputChannel: TextChannel; 
}