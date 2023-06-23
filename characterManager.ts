import { Character, Disciplines } from "./character.ts";
import { logger } from "./logger.ts";
import { labels } from "./i18n/labels.ts";
import { User, base64url, path, pdf } from "./deps.ts";
import { buildLightPdf } from "./characterServe.ts";
import { charactersPath } from "./config.ts";

const margin = 5000;

export const characters: {
  [id: string]: Character
} = {};

export const users: {
  [id: string]: string
} = {};

export async function load(): Promise<void> {
  for await (const entry of Deno.readDir(charactersPath)) {
    if (entry.isFile && entry.name.endsWith(".pdf")) {
      await loadCharacter(entry.name, base64url.encode(entry.name));
    }
  }
}

export async function watch(): Promise<void> {
  for await (const event of Deno.watchFs(charactersPath, { recursive: false })) {
    if (event.kind == "create" || event.kind == "modify") {
      for (const file of event.paths.map(p => path.parse(p))) {
        if (file.ext == ".pdf") {
          const id = base64url.encode(file.base);
          if (!characters[id]
            || (characters[id] && (new Date().getTime() - characters[id].dateTime.getTime()) > margin)) {
            await loadCharacter(file.base, id);
          }
        }
      }
    }
  }
}

export async function saveCharacter(url: string, user: User) {
  const response = await fetch(url);

  if (response.ok) {
    await Deno.writeFile(`${charactersPath}/${user.username}[${user.id}].pdf`, response.body!);
  }
}

export function getUserIdByCharacterId(characterId: string): string | undefined {
  const pair = Object.entries(users).find(p => p[1] == characterId);
  return pair?.[0];
}

async function loadCharacter(file: string, id: string) {
  try {
    const dateTime = new Date();

    const arrayBuffer = await Deno.readFile(`${charactersPath}/${file}`);

    const document = await pdf.PDFDocument.load(arrayBuffer);

    const form = document.getForm();

    const stamina = extract(form, "stamina", 1, 5);
    const composure = extract(form, "composure", 1, 5);
    const resolve = extract(form, "resolve", 1, 5);

    const healthSuperficial = extract(form, "health_superficial", 1, 10);
    const healthAggravated = extract(form, "health_aggravated", 1, 10);
    const willpowerSuperficial = extract(form, "willpower_superficial", 1, 10);
    const willpowerAggravated = extract(form, "willpower_aggravated", 1, 10);

    const bloodPotencyHigh = extract(form, "bloodPotency", 1, 5, ".high");

    const disciplines: Disciplines = {
      animalism: 0,
      auspex: 0,
      bloodSorcery: 0,
      celerity: 0,
      dominate: 0,
      fortitude: 0,
      obfuscate: 0,
      oblivion: 0,
      potence: 0,
      presence: 0,
      protean: 0,
      thinBloodAlchemy: 0
    }

    for (const suffix of [".0.0", ".0.1", ".0.2", ".1.0", ".1.1", ".1.2"]) {
      const value = extract(form, "discipline", 1, 5, suffix);

      switch (extractDropdownSelected(form, `discipline${suffix}`)) {
        case 1:
          disciplines.thinBloodAlchemy = value;
          break;
        case 2:
          disciplines.animalism = value;
          break;
        case 3:
          disciplines.auspex = value;
          break;
        case 4:
          disciplines.celerity = value;
          break;
        case 5:
          disciplines.dominate = value;
          break;
        case 6:
          disciplines.bloodSorcery = value;
          break;
        case 7:
          disciplines.fortitude = value;
          break;
        case 8:
          disciplines.oblivion = value;
          break;           
        case 9:
          disciplines.obfuscate = value;
          break;                   
        case 10:
          disciplines.potence = value;
          break;
        case 11:
          disciplines.presence = value;
          break;
        case 12:
          disciplines.protean = value;
          break;
      }
    }

    const character: Character = {
      dateTime: dateTime,
      name: form.getTextField("name").getText() || "",
      generation: extractDropdownSelected(form, "generation", i => i > 0 ? 17 - i : 0),
      attributes: {
        physical: {
          strength: extract(form, "strength", 1, 5),
          dexterity: extract(form, "dexterity", 1, 5),
          stamina: stamina
        },
        social: {
          charisma: extract(form, "charisma", 1, 5),
          manipulation: extract(form, "manipulation", 1, 5),
          composure: composure
        },
        mental: {
          intelligence: extract(form, "intelligence", 1, 5),
          wits: extract(form, "wits", 1, 5),
          resolve: resolve
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
      disciplines: disciplines,
      health: {
        superficial: healthSuperficial,
        aggravated: healthAggravated,
        penalty: penalty((stamina + 3) - (healthSuperficial + healthAggravated))
      },
      willpower: {
        superficial: willpowerSuperficial,
        aggravated: willpowerAggravated,
        penalty: penalty((composure + resolve) - (willpowerSuperficial + willpowerAggravated))
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

    characters[id] = character;

    const userIdStart = file.lastIndexOf('[');
    const userIdEnd = file.lastIndexOf(']');

    if (userIdStart > -1 && userIdEnd > -1 && userIdStart < userIdEnd) {
      const userId = file.substring(userIdStart + 1, userIdEnd);
      users[userId] = id;
      await buildLightPdf(userId, file);
    }

    logger.info(labels.loadCharacterSuccess, character.name, JSON.stringify(character));
  }
  catch (error) {
    logger.error(labels.loadCharacterError, file);
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

function penalty(left: number): number {
  return left <= 0 ? 3 : (left >= 1 && left <= 3 ? (3 - left) : 0);
}