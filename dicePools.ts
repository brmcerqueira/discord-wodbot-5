import { Character } from "./character.ts"
import { labels } from "./i18n/labels.ts"

export type DicePoolResult = {
    dices: number, 
    difficulty: number
}

export type DicePool = {
    name: string,
    description: string,
    action: (character: Character) => DicePoolResult
}

export type DicePools = {
    [emoji: string]: DicePool
}

export const dicePools: DicePools = {
    '🤛🏻': {
        name: labels.dicePools.attackWithFists.name,
        description: labels.dicePools.attackWithFists.description,
        action: c => {
            return {
                dices: c.attributes.physical.strength + c.skills.physical.brawl,
                difficulty: 1
            };
        }
    }
}