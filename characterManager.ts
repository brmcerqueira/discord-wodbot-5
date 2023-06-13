import { Character } from "./character.ts";
import * as googleSheets from "./googleSheets.ts";
import { config } from "./config.ts";
import * as binds from "./characterBinds.ts";
import { logger } from "./logger.ts";
import { labels } from "./i18n/labels.ts";

export const characters: {
    [id: string]: Character
} = {};

function parseValues(data: googleSheets.ValuesBatchGetResult): { [key: string]: string[] } {
    const result: { [key: string]: string[] } = {};
    data.valueRanges.forEach(e => {
        result[e.range] = e.values && e.values[0] ? e.values[0] : [""];
    });
    return result;
}

async function get(id: string): Promise<Character> {
    const ranges: string[] = [];

    for (const value of Object.values(binds)) {
        ranges.push(value);
    }

    const data = await googleSheets.valuesBatchGet(id, "COLUMNS", ranges);

    const values = parseValues(data!);

    return {
        name: values[binds.name][0],
        generation: parseInt(values[binds.generation][0]),
        attributes: {
            physical: {
                strength: parseInt(values[binds.attributesPhysical][0]),
                dexterity: parseInt(values[binds.attributesPhysical][1]),
                stamina: parseInt(values[binds.attributesPhysical][2])
            },
            social: {
                charisma: parseInt(values[binds.attributesSocial][0]),
                manipulation: parseInt(values[binds.attributesSocial][1]),
                composure: parseInt(values[binds.attributesSocial][2])
            },
            mental: {
                intelligence: parseInt(values[binds.attributesMental][0]),
                wits: parseInt(values[binds.attributesMental][1]),
                resolve: parseInt(values[binds.attributesMental][2])
            }
        },
        skills: {
            physical: {
                athletics: parseInt(values[binds.skillsPhysical][4]),
                brawl: parseInt(values[binds.skillsPhysical][2]),
                craft: parseInt(values[binds.skillsPhysical][7]),
                drive: parseInt(values[binds.skillsPhysical][3]),
                firearms: parseInt(values[binds.skillsPhysical][1]),
                melee: parseInt(values[binds.skillsPhysical][0]),
                larceny: parseInt(values[binds.skillsPhysical][6]),
                stealth: parseInt(values[binds.skillsPhysical][5]),
                survival: parseInt(values[binds.skillsPhysical][8])
            },
            social: {
                animalKen: parseInt(values[binds.skillsSocial][1]),
                etiquette: parseInt(values[binds.skillsSocial][2]),
                insight: parseInt(values[binds.skillsSocial][0]),
                intimidation: parseInt(values[binds.skillsSocial][3]),
                leadership: parseInt(values[binds.skillsSocial][5]),
                performance: parseInt(values[binds.skillsSocial][7]),
                persuasion: parseInt(values[binds.skillsSocial][8]),
                streetwise: parseInt(values[binds.skillsSocial][6]),
                subterfuge: parseInt(values[binds.skillsSocial][4])
            },
            mental: {
                academics: parseInt(values[binds.skillsMental][0]),
                awareness: parseInt(values[binds.skillsMental][2]),
                finance: parseInt(values[binds.skillsMental][3]),
                investigation: parseInt(values[binds.skillsMental][4]),
                medicine: parseInt(values[binds.skillsMental][5]),
                occult: parseInt(values[binds.skillsMental][6]),
                politics: parseInt(values[binds.skillsMental][7]),
                science: parseInt(values[binds.skillsMental][1]),
                technology: parseInt(values[binds.skillsMental][8])
            }
        },
        health: {
            superficial: parseInt(values[binds.health][0]),
            aggravated: parseInt(values[binds.health][1]),
            penalty: parseInt(values[binds.health][2])
        },
        willpower: {
            superficial: parseInt(values[binds.willpower][0]),
            aggravated: parseInt(values[binds.willpower][1]),
            penalty: parseInt(values[binds.willpower][2])
        },
        humanity: {
            total: parseInt(values[binds.humanity][0]),
            stains: parseInt(values[binds.humanity][1])
        },
        bloodPotency: parseInt(values[binds.bloodPotency][0]),
        hunger: parseInt(values[binds.hunger][0]),
        experience: {
            total: parseInt(values[binds.experienceTotal][0]),
            spent: parseInt(values[binds.experienceSpent][0])
        }
    }
}

async function loadCharacter(id: string) {
    const character = await get(id);
    logger.info(labels.loadCharacterSuccess, character.name);
    characters[id] = character;
}

export async function load(): Promise<void> {
    for (const id of Object.values(config.playerCharacters)) {
        await loadCharacter(id);
    }

    for (const id of config.storytellerCharacters) {
        await loadCharacter(id);
    }
}



export async function updateExperience(id: string, update: (value: number) => number): Promise<void> {
    await updateValue(id, binds.experienceTotal, labels.updateExperienceSuccess, update);
}

export async function updateHunger(id: string, update: (value: number) => number): Promise<void> {
    await updateValue(id, binds.hunger, labels.updateHungerSuccess, update);
}

async function updateValue(id: string, range: string, label: string, update: (value: number) => number): Promise<void> {
    const data = await googleSheets.valuesBatchGet(id, "ROWS", [range]);
    let value = 0;

    for (const item of data!.valueRanges) {
        if (item.range == range) {
            value = item.values && item.values[0] && item.values[0][0] ? update(parseInt(item.values[0][0])) : 0;
            break;
        }
    }

    await googleSheets.valuesUpdate(id, range, "USER_ENTERED", {
        majorDimension: "ROWS",
        values: [[value]]
    });

    logger.info(label, characters[id].name, value);
}
