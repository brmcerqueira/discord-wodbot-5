import { Action } from "./action.ts";
import { Character } from "./character.ts"
import { ButtonStyle } from "./deps.ts";
import { DicePool, createScope } from "./scope.ts";
import { dicePoolSolver } from "./solver/dicePoolSolver.ts";
import { labels } from "./i18n/labels.ts";
import { DicePoolType } from "./i18n/labelsType.ts";

export type DicePoolResult = {
    dices: number,
    modifier: number, 
    difficulty: number
}

export type DicePoolBuilder = (character: Character) => DicePoolResult;

export type DicePool = {
    name: string,
    description: string,
    build: DicePoolBuilder
}

export type DicePools = {
    [emoji: string]: DicePool
}

export function buildActions(): Action[] {
    return dicePools.map((build: DicePoolBuilder, index: number) => {
        const label: DicePoolType = labels.dicePools.length > index ? labels.dicePools[index] : {
            name: `${index}.name`,
            description: `${index}.description`,
        }

        const dicePool: DicePool = {
            name: label.name,
            description: label.description,
            build: build
        }

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

const dicePools: DicePoolBuilder[] = [
    c => {
        return {
            dices: c.attributes.social.manipulation + c.skills.social.intimidation,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.physical.strength + c.skills.physical.brawl,
            modifier: -c.health.penalty,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.social.charisma + c.skills.social.performance,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.physical.dexterity + c.skills.social.etiquette,
            modifier: -c.health.penalty,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.physical.stamina + c.skills.physical.athletics,
            modifier: -c.health.penalty,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.mental.wits + c.skills.social.intimidation,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.mental.intelligence + c.skills.physical.larceny,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.social.charisma + c.skills.social.streetwise,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.mental.wits + c.skills.physical.drive,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.social.manipulation + c.skills.social.animalKen,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.mental.wits + c.skills.physical.drive,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.mental.wits + c.skills.physical.survival,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.physical.stamina + c.skills.physical.stealth,
            modifier: -c.health.penalty,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.social.charisma + c.skills.social.intimidation,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.mental.intelligence + c.skills.mental.occult,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.mental.wits + c.skills.physical.craft,
            modifier: 0,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.physical.dexterity + c.skills.social.subterfuge,
            modifier: -c.health.penalty,
            difficulty: 1
        };
    },
    c => {
        return {
            dices: c.attributes.social.manipulation + c.skills.social.persuasion,
            modifier: 0,
            difficulty: 1
        };
    }
]