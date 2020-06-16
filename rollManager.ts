import { RollResult } from "./dicePool.ts";

export type RollManager = {
    [userId: string]: RollResult
}

export const rollManager: RollManager = {};

export const difficulty: { current: number | null } = { current: null };