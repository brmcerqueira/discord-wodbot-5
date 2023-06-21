import { Action } from "./action.ts";
import { Character } from "./character.ts"
import { ButtonStyle } from "./deps.ts";
import { labels } from "./i18n/labels.ts"
import { DicePool, createScope } from "./scope.ts";
import { dicePoolSolver } from "./solver/dicePoolSolver.ts";

export type DicePoolResult = {
    dices: number, 
    difficulty: number
}

export type DicePool = {
    name: string,
    description: string,
    build: (character: Character) => DicePoolResult
}

export type DicePools = {
    [emoji: string]: DicePool
}

export function buildActions(): Action[] {
    return dicePools.map(dicePool => {
        return {
          message: `__**${dicePool.name}**__`,
          buttons: [{
              style: ButtonStyle.SECONDARY,
              emoji: {
                  name: '🎲'
              },
              value: dicePool
          }],
          scopes: [DicePool, createScope()],
          solve: dicePoolSolver
        };
      })
}

const dicePools: DicePool[] = [
    {
        name: labels.dicePools.attackWithFists.name,
        description: labels.dicePools.attackWithFists.description,
        build: c => {
            return {
                dices: c.attributes.physical.strength + c.skills.physical.brawl,
                difficulty: 1
            };
        }
    }
]