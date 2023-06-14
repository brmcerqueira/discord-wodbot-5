import { dicePoolButton } from "./buttons/dicePoolButton.ts";
import { Character } from "./character.ts"
import { Command, DicePool, createCommandScope } from "./command.ts";
import { ButtonStyle } from "./deps.ts";
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

export function buildCommands(): Command[] {
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
          scopes: [DicePool, createCommandScope()],
          action: dicePoolButton
        };
      })
}

const dicePools: DicePool[] = [
    {
        name: labels.dicePools.attackWithFists.name,
        description: labels.dicePools.attackWithFists.description,
        action: c => {
            return {
                dices: c.attributes.physical.strength + c.skills.physical.brawl,
                difficulty: 1
            };
        }
    }
]