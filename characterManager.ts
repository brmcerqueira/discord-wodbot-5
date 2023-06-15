import { Character } from "./character.ts";
import * as googleSheets from "./googleSheets.ts";
import { config } from "./config.ts";
import * as binds from "./characterBinds.ts";
import { logger } from "./logger.ts";
import { labels } from "./i18n/labels.ts";
import { PDFDocument } from "./deps.ts";

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
    const pdfDoc = await PDFDocument.load(await Deno.readFile("./sheet.pdf"));

    const form = pdfDoc.getForm();
    
/*
 PDFCheckBox2: FOR1
 PDFCheckBox2: FOR2
 PDFCheckBox2: FOR3
 PDFCheckBox2: FOR4
 PDFCheckBox2: FOR5
 PDFCheckBox2: DES1
 PDFCheckBox2: DES2
 PDFCheckBox2: DES3
 PDFCheckBox2: DES4
 PDFCheckBox2: DES5
 PDFCheckBox2: CAR5
 PDFCheckBox2: CAR2
 PDFCheckBox2: CAR3
 PDFCheckBox2: CAR4
 PDFCheckBox2: CAR1
 PDFCheckBox2: MAN5
 PDFCheckBox2: MAN2
 PDFCheckBox2: MAN3
 PDFCheckBox2: MAN4
 PDFCheckBox2: MAN1
 PDFCheckBox2: AUT1
 PDFCheckBox2: AUT2
 PDFCheckBox2: AUT4
 PDFCheckBox2: AUT5
 PDFCheckBox2: AUT3
 PDFCheckBox2: INT1
 PDFCheckBox2: INT2
 PDFCheckBox2: INT3
 PDFCheckBox2: INT4
 PDFCheckBox2: INT5
 PDFCheckBox2: RAC1
 PDFCheckBox2: RAC2
 PDFCheckBox2: RAC3
 PDFCheckBox2: RAC4
 PDFCheckBox2: RAC5
 PDFCheckBox2: DET1
 PDFCheckBox2: DET2
 PDFCheckBox2: DET3
 PDFCheckBox2: DET4
 PDFCheckBox2: DET5
 PDFCheckBox2: VIT1
 PDFCheckBox2: VIT2
 PDFCheckBox2: VIT3
 PDFCheckBox2: VIT4
 PDFCheckBox2: VIT5
 PDFCheckBox2: VIT6
 PDFCheckBox2: VIT7
 PDFCheckBox2: VIT8
 PDFCheckBox2: VIT9
 PDFCheckBox2: VIT0
 PDFCheckBox2: VIG1
 PDFCheckBox2: VIG3
 PDFCheckBox2: VIG2
 PDFCheckBox2: VIG4
 PDFCheckBox2: VIG5
 PDFCheckBox2: ArBr1
 PDFCheckBox2: ArBr2
 PDFCheckBox2: ArBr3
 PDFCheckBox2: ArBr4
 PDFCheckBox2: ArBr5
 PDFCheckBox2: ArFo1
 PDFCheckBox2: ArFo2
 PDFCheckBox2: ArFo3
 PDFCheckBox2: ArFo4
 PDFCheckBox2: ArFo5
 PDFCheckBox2: Atle1
 PDFCheckBox2: Atle2
 PDFCheckBox2: Atle3
 PDFCheckBox2: Atle4
 PDFCheckBox2: Atle5
 PDFCheckBox2: Brig1
 PDFCheckBox2: Brig2
 PDFCheckBox2: Brig3
 PDFCheckBox2: Brig4
 PDFCheckBox2: Brig5
 PDFCheckBox2: Cond1
 PDFCheckBox2: Cond2
 PDFCheckBox2: Cond3
 PDFCheckBox2: Cond4
 PDFCheckBox2: Cond5
 PDFCheckBox2: Fund1
 PDFCheckBox2: Fund2
 PDFCheckBox2: Fund3
 PDFCheckBox2: Fund4
 PDFCheckBox2: Fund5
 PDFCheckBox2: Ladr1
 PDFCheckBox2: Ladr2
 PDFCheckBox2: Ladr3
 PDFCheckBox2: Ladr4
 PDFCheckBox2: Ladr5
 PDFCheckBox2: Ofic1
 PDFCheckBox2: Ofic2
 PDFCheckBox2: Ofic3
 PDFCheckBox2: Ofic4
 PDFCheckBox2: Ofic5
 PDFCheckBox2: Sobr1
 PDFCheckBox2: Sobr2
 PDFCheckBox2: Sobr3
 PDFCheckBox2: Sobr4
 PDFCheckBox2: Sobr5
 PDFTextField2: NOME DO PERSONAGEM
 PDFTextField2: CRÔNICA
 PDFTextField2: SENHOR
 PDFTextField2: CONCEITO
 PDFTextField2: AMBIÇÃO
 PDFTextField2: DESEJO
 PDFTextField2: PREDADOR
 PDFTextField2: CLÃ
 PDFTextField2: Pilares & Convicções
 PDFCheckBox2: EmCA5
 PDFCheckBox2: Etiq5
 PDFCheckBox2: Inti5
 PDFCheckBox2: Lide5
 PDFCheckBox2: Manh5
 PDFCheckBox2: Perf5
 PDFCheckBox2: Pers5
 PDFCheckBox2: Saga5
 PDFCheckBox2: Saga4
 PDFCheckBox2: Saga3
 PDFCheckBox2: Saga2
 PDFCheckBox2: Saga1
 PDFCheckBox2: Pers4
 PDFCheckBox2: Pers3
 PDFCheckBox2: Pers2
 PDFCheckBox2: Pers1
 PDFCheckBox2: Perf4
 PDFCheckBox2: Perf3
 PDFCheckBox2: Perf2
 PDFCheckBox2: Perf1
 PDFCheckBox2: Manh4
 PDFCheckBox2: Manh3
 PDFCheckBox2: Manh2
 PDFCheckBox2: Manh1
 PDFCheckBox2: Lide4
 PDFCheckBox2: Lide3
 PDFCheckBox2: Lide2
 PDFCheckBox2: Lide1
 PDFCheckBox2: Inti4
 PDFCheckBox2: Inti3
 PDFCheckBox2: Inti2
 PDFCheckBox2: Inti1
 PDFCheckBox2: Etiq4
 PDFCheckBox2: Etiq3
 PDFCheckBox2: Etiq2
 PDFCheckBox2: Etiq1
 PDFCheckBox2: Subt1
 PDFCheckBox2: EmCA4
 PDFCheckBox2: EmCA3
 PDFCheckBox2: EmCA2
 PDFCheckBox2: EmCA1
 PDFCheckBox2: Subt2
 PDFCheckBox2: Subt3
 PDFCheckBox2: Subt4
 PDFCheckBox2: Subt5
 PDFCheckBox2: Cien1
 PDFCheckBox2: Cien2
 PDFCheckBox2: Cien3
 PDFCheckBox2: Cien4
 PDFCheckBox2: Cien5
 PDFCheckBox2: Erud1
 PDFCheckBox2: Erud2
 PDFCheckBox2: Erud3
 PDFCheckBox2: Erud4
 PDFCheckBox2: Erud5
 PDFCheckBox2: Fina1
 PDFCheckBox2: Fina2
 PDFCheckBox2: Fina3
 PDFCheckBox2: Fina4
 PDFCheckBox2: Fina5
 PDFCheckBox2: Inve1
 PDFCheckBox2: Inve2
 PDFCheckBox2: Inve3
 PDFCheckBox2: Inve4
 PDFCheckBox2: Inve5
 PDFCheckBox2: Medi1
 PDFCheckBox2: Medi2
 PDFCheckBox2: Medi3
 PDFCheckBox2: Medi4
 PDFCheckBox2: Medi5
 PDFCheckBox2: Ocul1
 PDFCheckBox2: Ocul2
 PDFCheckBox2: Ocul3
 PDFCheckBox2: Ocul4
 PDFCheckBox2: Ocul5
 PDFCheckBox2: Perc1
 PDFCheckBox2: Perc2
 PDFCheckBox2: Perc3
 PDFCheckBox2: Perc4
 PDFCheckBox2: Perc5
 PDFCheckBox2: Poli1
 PDFCheckBox2: Poli2
 PDFCheckBox2: Poli3
 PDFCheckBox2: Poli4
 PDFCheckBox2: Poli5
 PDFCheckBox2: Tecn1
 PDFCheckBox2: Tecn2
 PDFCheckBox2: Tecn3
 PDFCheckBox2: Tecn4
 PDFCheckBox2: Tecn5
 PDFCheckBox2: DSCP1.1
 PDFCheckBox2: DSCP1.2
 PDFCheckBox2: DSCP1.3
 PDFCheckBox2: DSCP1.4
 PDFCheckBox2: DSCP1.5
 PDFCheckBox2: DSCP2.1
 PDFCheckBox2: DSCP2.2
 PDFCheckBox2: DSCP2.3
 PDFCheckBox2: DSCP2.4
 PDFCheckBox2: DSCP2.5
 PDFCheckBox2: DSCP3.1
 PDFCheckBox2: DSCP3.2
 PDFCheckBox2: DSCP3.4
 PDFCheckBox2: DSCP3.5
 PDFCheckBox2: DSCP3.3
 PDFTextField2: GERAÇÃO
 PDFTextField2: DISCIPLINA 1
 PDFTextField2: DISCIPLINA 2
 PDFTextField2: DISCIPLINA 3
 PDFTextField2: DISCIPLINA 4
 PDFTextField2: DISCIPLINA 5
 PDFCheckBox2: DSCP4.1
 PDFCheckBox2: DSCP4.2
 PDFCheckBox2: DSCP4.3
 PDFCheckBox2: DSCP4.4
 PDFCheckBox2: DSCP4.5
 PDFCheckBox2: DSCP5.1
 PDFCheckBox2: DSCP5.2
 PDFCheckBox2: DSCP5.3
 PDFCheckBox2: DSCP5.4
 PDFCheckBox2: DSCP5.5
 PDFCheckBox2: DSCP6.1
 PDFCheckBox2: DSCP6.2
 PDFCheckBox2: DSCP6.3
 PDFCheckBox2: DSCP6.4
 PDFCheckBox2: DSCP6.5
 PDFCheckBox2: Fome1
 PDFCheckBox2: Fome2
 PDFCheckBox2: Fome3
 PDFCheckBox2: Fome4
 PDFCheckBox2: Fome5
 PDFCheckBox2: FdV1
 PDFCheckBox2: FdV2
 PDFCheckBox2: FdV3
 PDFCheckBox2: FdV4
 PDFCheckBox2: FdV5
 PDFCheckBox2: FdV6
 PDFCheckBox2: FdV7
 PDFCheckBox2: FdV8
 PDFCheckBox2: FdV9
 PDFCheckBox2: FdV0
 PDFCheckBox2: Humanidade1
 PDFCheckBox2: Humanidade2
 PDFCheckBox2: Humanidade3
 PDFCheckBox2: Humanidade4
 PDFCheckBox2: Humanidade5
 PDFCheckBox2: Humanidade6
 PDFCheckBox2: Humanidade7
 PDFCheckBox2: Humanidade8
 PDFCheckBox2: Humanidade9
 PDFCheckBox2: Humanidade0
 PDFTextField2: Princípios da Crônica
 PDFTextField2: Desc.Disc.1
 PDFTextField2: Desc.Disc.2
 PDFTextField2: Desc.Disc.3
 PDFTextField2: Desc.Disc.4
 PDFTextField2: Desc.Disc.5
 PDFTextField2: Desc.Disc.6
 PDFCheckBox2: PdS6
 PDFCheckBox2: PdS7
 PDFCheckBox2: PdS8
 PDFCheckBox2: PdS9
 PDFCheckBox2: PdS0
 PDFCheckBox2: PdS1
 PDFCheckBox2: PdS2
 PDFCheckBox2: PdS3
 PDFCheckBox2: PdS4
 PDFCheckBox2: PdS5
 PDFCheckBox2: V&D1.1
 PDFCheckBox2: V&D1.2
 PDFCheckBox2: V&D1.3
 PDFCheckBox2: V&D1.4
 PDFCheckBox2: V&D1.5
 PDFTextField2: DISCIPLINA 6
 PDFCheckBox2: V&D2.5
 PDFCheckBox2: V&D2.4
 PDFCheckBox2: V&D2.3
 PDFCheckBox2: V&D2.2
 PDFCheckBox2: V&D2.1
 PDFCheckBox2: V&D3.1
 PDFCheckBox2: V&D3.2
 PDFCheckBox2: V&D3.3
 PDFCheckBox2: V&D3.4
 PDFCheckBox2: V&D3.5
 PDFCheckBox2: V&D4.1
 PDFCheckBox2: V&D4.2
 PDFCheckBox2: V&D4.3
 PDFCheckBox2: V&D4.4
 PDFCheckBox2: V&D4.5
 PDFTextField2: Vantagens e Defeitos 1
 PDFTextField2: Vantagens e Defeitos 2
 PDFTextField2: Vantagens e Defeitos 3
 PDFTextField2: Vantagens e Defeitos 4
 PDFTextField2: Vantagens e Defeitos 5
 PDFCheckBox2: V&D5.1
 PDFCheckBox2: V&D5.2
 PDFCheckBox2: V&D5.3
 PDFCheckBox2: V&D5.4
 PDFCheckBox2: V&D5.5
 PDFCheckBox2: V&D6.1
 PDFCheckBox2: V&D6.2
 PDFCheckBox2: V&D6.3
 PDFCheckBox2: V&D6.4
 PDFCheckBox2: V&D6.5
 PDFCheckBox2: V&D7.1
 PDFCheckBox2: V&D7.2
 PDFCheckBox2: V&D7.3
 PDFCheckBox2: V&D7.4
 PDFCheckBox2: V&D7.5
 PDFCheckBox2: V&D8.1
 PDFCheckBox2: V&D8.2
 PDFCheckBox2: V&D8.3
 PDFCheckBox2: V&D8.4
 PDFCheckBox2: V&D8.5
 PDFTextField2: Vantagens e Defeitos 6
 PDFTextField2: Vantagens e Defeitos 7
 PDFTextField2: Vantagens e Defeitos 8
 PDFTextField2: Vantagens e Defeitos 9
 PDFTextField2: Vantagens e Defeitos 10
 PDFTextField2: Vantagens e Defeitos 11
 PDFCheckBox2: V&D9.1
 PDFCheckBox2: V&D9.2
 PDFCheckBox2: V&D9.3
 PDFCheckBox2: V&D9.4
 PDFCheckBox2: V&D9.5
 PDFCheckBox2: V&D10.1
 PDFCheckBox2: V&D10.2
 PDFCheckBox2: V&D10.3
 PDFCheckBox2: V&D10.4
 PDFCheckBox2: V&D10.5
 PDFCheckBox2: V&D11.1
 PDFCheckBox2: V&D11.2
 PDFCheckBox2: V&D11.3
 PDFCheckBox2: V&D11.4
 PDFCheckBox2: V&D11.5
 PDFTextField2: Perdição do Clã
 PDFTextField2: Notas
 PDFTextField2: Surto de Sangue
 PDFTextField2: Quantidade Recuperada
 PDFTextField2: Rerrolagem de Sangue
 PDFTextField2: Bônus de Poder
 PDFTextField2: Penalidade de Alimentação
 PDFTextField2: Ressonância
 PDFTextField2: XP Total
 PDFTextField2: XP Gasta
 PDFTextField2: Idade Verdadeira
 PDFTextField2: Idade Aparente
 PDFTextField2: Data de Nascimento
 PDFTextField2: Data de Morte
 PDFTextField2: Gravidade da Perdição
 PDFTextField2: Aparência
 PDFTextField2: Traços Distintivos
 PDFTextField2: História
 PDFRadioGroup2: Reset
 */
    return {
        name: form.getTextField("NOME DO PERSONAGEM").getText(),
        generation: 0,
        attributes: {
            physical: {
                strength: extract(form, "FOR", 1, 5),
                dexterity: extract(form, "DES", 1, 5),
                stamina: extract(form, "VIG", 1, 5)
            },
            social: {
                charisma: 0,
                manipulation: 0,
                composure: 0
            },
            mental: {
                intelligence: 0,
                wits: 0,
                resolve: 0
            }
        },
        skills: {
            physical: {
                athletics: 0,
                brawl: 0,
                craft: 0,
                drive: 0,
                firearms: 0,
                melee: 0,
                larceny: 0,
                stealth: 0,
                survival: 0
            },
            social: {
                animalKen: 0,
                etiquette: 0,
                insight: 0,
                intimidation: 0,
                leadership: 0,
                performance: 0,
                persuasion: 0,
                streetwise: 0,
                subterfuge: 0
            },
            mental: {
                academics: 0,
                awareness: 0,
                finance: 0,
                investigation: 0,
                medicine: 0,
                occult: 0,
                politics: 0,
                science: 0,
                technology: 0
            }
        },
        health: {
            superficial: 0,
            aggravated: 0,
            penalty: 0
        },
        willpower: {
            superficial: 0,
            aggravated: 0,
            penalty: 0
        },
        humanity: {
            total: 0,
            stains: 0
        },
        bloodPotency: 0,
        hunger: 0,
        experience: {
            total: 0,
            spent: 0
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

function extract(form: any, pre: string, min: number, max: number): number {
    for (let index = max; index >= min; index--) {
        if (form.getCheckBox(`${pre}${index}`).isChecked()) {
            return index;
        }       
    }
    return 0;
}