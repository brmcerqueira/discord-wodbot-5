import { Character } from "./character.ts";
import { logger } from "./logger.ts";
import { labels } from "./i18n/labels.ts";
import { base64, path, pdf } from "./deps.ts";
import { buildLightPdf } from "./characterServe.ts";
import { charactersPath } from "./config.ts";

const margin = 5000;

export const characters: {
    [id: string]: Character
} = {};

export const users: {
    [id: string]: string
} = {};

const documents: {
    [id: string]: { document: pdf.PDFDocument, file: string, dateTime: Date }
} = {};

export async function load(): Promise<void> {
    for await (const entry of Deno.readDir(charactersPath)) {
        if (entry.isFile && entry.name.endsWith(".pdf")) {
            await loadCharacter(entry.name, base64.encode(entry.name));      
        }
    }
}

export async function watch(): Promise<void> {
    for await (const event of Deno.watchFs(charactersPath, { recursive: false })) {
        if (event.kind == "create" || event.kind == "modify") {
            for (const file of event.paths.map(p => path.parse(p))) {
                if (file.ext == ".pdf") {  
                    const id = base64.encode(file.base); 
                    if (!documents[id] 
                        || (documents[id] && (new Date().getTime() - documents[id].dateTime.getTime()) > margin)) {
                        await loadCharacter(file.base, id); 
                    }                                              
                }
            }
        }
    }
}

async function loadCharacter(file: string, id: string) {
  const arrayBuffer = await Deno.readFile(`${charactersPath}/${file}`);

  documents[id] = { document: await pdf.PDFDocument.load(arrayBuffer), file, dateTime: new Date() };

  const form = documents[id].document.getForm();

  const bloodPotencyHigh = extract(form, "bloodPotency", 1, 5, ".high");

  const character: Character = {
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
  };

  logger.info(labels.loadCharacterSuccess, character.name);

  characters[id] = character;

  const userIdStart = file.lastIndexOf('[');
  const userIdEnd = file.lastIndexOf(']');

  if(userIdStart > -1 && userIdEnd > -1 && userIdStart < userIdEnd) {
    const userId = file.substring(userIdStart + 1, userIdEnd);
    users[userId] = id;
    await buildLightPdf(userId, file);
  }
}

export async function updateExperience(id: string, update: (value: number) => number): Promise<void> {
    let value = 0;
    const character = characters[id];
    await updatePdf(id, form => {
        value = update(character.experience.total);
        form.getTextField("experience.total").setText(value.toString());
    })
    logger.info(labels.updateExperienceSuccess, character.name, value);
    character.experience.total = value;
}

export async function updateHunger(id: string, update: (value: number) => number): Promise<void> {
    let value = 0;
    const character = characters[id];
    await updatePdf(id, form => {
        value = update(character.hunger);
        updateCheckBoxes(form, "hunger", 1, 5, value);
    })
    logger.info(labels.updateHungerSuccess, character.name, value);
    character.hunger = value;
}

async function updatePdf(id: string, update: (form: pdf.PDFForm) => void) {
    const pair = documents[id];
    const document = pair.document;
    update(document.getForm());
    const pairUserId = Object.entries(users).find(p => p[1] == id);
    pair.file = `${characters[id].name}${pairUserId ? `[${pairUserId[0]}]` : ""}.pdf`;
    await Deno.writeFile(`${charactersPath}/${pair.file}`,
    await document.save({ updateFieldAppearances: false }));
    if (pairUserId) {
        await buildLightPdf(pairUserId[0], pair.file);
    }
}

function extract(form: pdf.PDFForm, prefix: string, min: number, max: number, suffix?: string): number {
    for (let index = max; index >= min; index--) {
        if (form.getCheckBox(`${prefix}_${index}${suffix || ""}`).isChecked()) {
            return index;
        }
    }
    return 0;
}

function extractDropdownSelected(form: pdf.PDFForm, name: string, parseResult?: (i: number) => number): number {
    const dropdown = form.getDropdown(name);
    const options: string[] = dropdown.getOptions();
    const selected: string[] = dropdown.getSelected();

    let result = -1;

    for (let index = 0; index < options.length; index++) {
        if (selected.indexOf(options[index]) > -1) {
            result = index;
            break;
        }
    }

    return parseResult ? parseResult(result) : result;
}

function updateCheckBoxes(form: pdf.PDFForm, prefix: string, min: number, max: number, value: number, suffix?: string) {
    for (let index = min; index <= max; index++) {
        const checkBox = form.getCheckBox(`${prefix}_${index}${suffix || ""}`);
        if (index <= value) {
            checkBox.check();
        }
        else {
            checkBox.uncheck();
        }
    }
}