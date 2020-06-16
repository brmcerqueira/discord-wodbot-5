import { RollResult } from "./dicePool.ts";

export type ReRollManager = {
    [userId: string]: RollResult
}

export const reRollManager: ReRollManager = {};