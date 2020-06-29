import { Character } from "./character.ts";
import { googleSheets } from "./googleSheets.ts";

export module characterManager {
    const attributes: string = "Atributos";
    const skills: string = "Habilidades";

    module binds {
        export const name: string = `${attributes}!J2`;
        export const generation: string = `${attributes}!J9`;
        
        export const attributesPhysical: string = `${attributes}!D3:D5`;
        export const attributesSocial: string = `${attributes}!D7:D9`;
        export const attributesMental: string = `${attributes}!D11:D13`;

        export const skillsPhysical: string = `${skills}!D2:D10`;
        export const skillsSocial: string = `${skills}!D12:D20`;
        export const skillsMental: string = `${skills}!D22:D30`;

        export const health: string = `${attributes}!J13:J15`;
        export const willpower: string = `${attributes}!J17:J19`;
        export const humanity: string = `${attributes}!J21:J22`;

        export const bloodPotency: string = `${attributes}!D15`;
        export const hunger: string = `${attributes}!M17`;
        export const experienceTotal: string = `${attributes}!L7`;
        export const experienceSpent: string = `${attributes}!L5`;
    }

    function parseValues(data: googleSheets.ValuesBatchGetResult): { [key: string]: string[] } {
        let result: { [key: string]: string[] } = {};
        data.valueRanges.forEach(e => { 
            result[e.range] = e.values && e.values[0] ? e.values[0] : [""];
        });
        return result;
    }

    export function get(id: string): Promise<Character> {
        let ranges: string[] = [];

        for (const value of Object.values(binds)) {
            ranges.push(value);
        }

        return googleSheets.valuesBatchGet(id, 
            googleSheets.ValuesBatchGetMajorDimension.Columns, ranges).then(data => {
                let values = parseValues(data);
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
            });
    }
}