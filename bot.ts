import { RollResult } from "./diceRollManager.ts";

export module bot {
    export type LastRolls = {
        [userId: string]: {
            messageId: string,
            result: RollResult
        }
    }
    
    export const lastRolls: LastRolls = {};
    
    export let difficulty: number | null = null;
}