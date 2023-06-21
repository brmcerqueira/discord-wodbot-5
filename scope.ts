import { config } from "./config.ts";
import { User } from "./deps.ts";

let scopeSeed = 0;

export type Scope = {
    value: number
}

export type CustomId = { index: number, scopes?: Scope[] };

const allScopes: Scope[] = [];

export function createScope(): Scope {
    const result = {
      value: 1 << scopeSeed
    };

    allScopes.push(result);

    scopeSeed++;

    return result;
}

export function buildId(index: number, ...scopes: Scope[]): string {
    return scopes.length > 0 ? `${scopes.reduce((total, current) => total + current.value, 0)}_${index}` : index.toString();
}

export function parseCustomId(id: string): CustomId {
    const split = id.split('_', 2);

    if (split.length == 2) {
        const bit = parseInt(split[0]);
    
        return { 
            index: parseInt(split[1]),
            scopes: allScopes.filter(s => (bit & s.value) === s.value)
        };
    }

    return { 
        index: parseInt(id) 
    };
}

export function checkScope(user: User, customId: CustomId, scopes: Scope[]): boolean {
    if (scopes.length > 0) {
        for (const scope of scopes) {
            if ((scope.value == Storyteller.value && user.id != config.storytellerId) 
            || (scope.value != Storyteller.value && (!customId.scopes || customId.scopes.indexOf(scope) == -1))) {
                return false;
            }
        }
    }

    return true;
}

export const Storyteller = createScope();
export const SetDifficulty = createScope();
export const SetBonus = createScope();
export const SetOnus = createScope();
export const ReloadCharacters = createScope();
export const ChangeCharacter = createScope();
export const ReRoll = createScope();
export const DicePool = createScope();