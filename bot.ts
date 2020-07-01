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

    export module dicePools {
        export let viewChannel: TextChannel;
        export let outputChannel: TextChannel;    
    }
}