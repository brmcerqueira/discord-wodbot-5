import { Character } from "./character.ts";
import * as googleSheets from "./googleSheets.ts";
import { config } from "./config.ts";
import * as binds from "./characterBinds.ts";
import { logger } from "./logger.ts";
import { labels } from "./i18n/labels.ts";
import { pdf } from "./deps.ts";

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

export async function getByPdf(): Promise<Character> {
    const pdfDoc = await pdf.PDFDocument.load(await Deno.readFile("./pdf/test.pdf"));

    const form = pdfDoc.getForm();

    const bloodPotencyHigh = extract(form, "bloodPotency", 1, 5, ".high");

    return {
        name: form.getTextField("name").getText() || "",
        generation: extractDropdownSelected(form, "generation", i => i > 0 ? 17 - i : 0),
        attributes: {
            physical: {
                strength: extract(form, "strength", 1, 5),
                dexterity: extract(form, "dexterity", 1, 5),
                stamina: extract(form, "stamina", 1, 5)
            },
            social: {
                charisma: extract(form, "charisma", 1, 5),
                manipulation: extract(form, "manipulation", 1, 5),
                composure: extract(form, "composure", 1, 5)
            },
            mental: {
                intelligence: extract(form, "intelligence", 1, 5),
                wits: extract(form, "wits", 1, 5),
                resolve: extract(form, "resolve", 1, 5)
            }
        },
        skills: {
            physical: {
                athletics: extract(form, "physical", 1, 5, ".athletics"),
                brawl: extract(form, "physical", 1, 5, ".brawl"),
                craft: extract(form, "physical", 1, 5, ".craft"),
                drive: extract(form, "physical", 1, 5, ".drive"),
                firearms: extract(form, "physical", 1, 5, ".firearms"),
                melee: extract(form, "physical", 1, 5, ".melee"),
                larceny: extract(form, "physical", 1, 5, ".larceny"),
                stealth: extract(form, "physical", 1, 5, ".stealth"),
                survival: extract(form, "physical", 1, 5, ".survival")
            },
            social: {
                animalKen: extract(form, "social", 1, 5, ".animalKen"),
                etiquette: extract(form, "social", 1, 5, ".etiquette"),
                insight: extract(form, "social", 1, 5, ".insight"),
                intimidation: extract(form, "social", 1, 5, ".intimidation"),
                leadership: extract(form, "social", 1, 5, ".leadership"),
                performance: extract(form, "social", 1, 5, ".performance"),
                persuasion: extract(form, "social", 1, 5, ".persuasion"),
                streetwise: extract(form, "social", 1, 5, ".streetwise"),
                subterfuge: extract(form, "social", 1, 5, ".subterfuge")
            },
            mental: {
                academics: extract(form, "mental", 1, 5, ".academics"),
                awareness: extract(form, "mental", 1, 5, ".awareness"),
                finance: extract(form, "mental", 1, 5, ".finance"),
                investigation: extract(form, "mental", 1, 5, ".investigation"),
                medicine: extract(form, "mental", 1, 5, ".medicine"),
                occult: extract(form, "mental", 1, 5, ".occult"),
                politics: extract(form, "mental", 1, 5, ".politics"),
                science: extract(form, "mental", 1, 5, ".science"),
                technology: extract(form, "mental", 1, 5, ".technology")
            }
        },
        health: {
            superficial: extract(form, "health_superficial", 1, 10),
            aggravated: extract(form, "health_aggravated", 1, 10),
            penalty: 0
        },
        willpower: {
            superficial: extract(form, "willpower_superficial", 1, 10),
            aggravated: extract(form, "willpower_aggravated", 1, 10),
            penalty: 0
        },
        humanity: {
            total: extract(form, "humanity_total", 1, 10),
            stains: extract(form, "humanity_stains", 1, 10)
        },
        bloodPotency: bloodPotencyHigh > 0 ? bloodPotencyHigh + 5 :
        extract(form, "bloodPotency", 1, 5, ".low"),
        hunger: extract(form, "hunger", 1, 5),
        experience: {
            total: parseInt(form.getTextField("experience.total").getText()!) || 0,
            spent: parseInt(form.getTextField("experience.spent").getText()!) || 0
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
    characters[id].experience.total = await updateValue(id, 
        binds.experienceTotal, labels.updateExperienceSuccess, update);    
}

export async function updateHunger(id: string, update: (value: number) => number): Promise<void> {
    characters[id].hunger = await updateValue(id, binds.hunger, labels.updateHungerSuccess, update);
}

async function updateValue(id: string, range: string, label: string, update: (value: number) => number): Promise<number> {
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

    return value;
}

function extract(form: any, pre: string, min: number, max: number, end?: string): number {
    for (let index = max; index >= min; index--) {
        if (form.getCheckBox(`${pre}_${index}${end || ""}`).isChecked()) {
            return index;
        }       
    }
    return 0;
}

function extractDropdownSelected(form: any, name: string, parseResult?: (i: number) => number): number {
    const dropdown = form.getDropdown(name);
    const options : string[] = dropdown.getOptions();
    const selected : string[] = dropdown.getSelected();

    let result = -1;

    for (let index = 0; index < options.length; index++) {
        if (selected.indexOf(options[index]) > -1) {
            result = index;
            break;
        }
    }

    return parseResult ? parseResult(result) : result;
}