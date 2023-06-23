import { pdf } from "../deps.ts";

const x = 4;
const y = 4;
const width = 7;
const height = 7;
const borderWidth = 0.8;

const checkBoxFillDrawing = pdf.drawRectangle({
    x: x,
    y: y,
    width: width,
    height: height,
    borderWidth: borderWidth,
    color: pdf.rgb(0, 0, 0),
    borderColor: pdf.rgb(0, 0, 0),
    rotate: pdf.degrees(0),
    xSkew: pdf.degrees(0),
    ySkew: pdf.degrees(0),
});

const checkBoxDrawing = pdf.drawRectangle({
    x: x,
    y: y,
    width: width,
    height: height,
    borderWidth: borderWidth,
    color: pdf.rgb(1, 1, 1),
    borderColor: pdf.rgb(0, 0, 0),
    rotate: pdf.degrees(0),
    xSkew: pdf.degrees(0),
    ySkew: pdf.degrees(0),
});

const checkMarkDrawing = pdf.drawCheckMark({
    x: 7.5,
    y: 7.5,
    size: 4,
    thickness: 1,
    color: pdf.rgb(0, 0, 0)
});

function editRange(form: pdf.PDFForm, pre: string, neww: string, min: number, max: number, group?: string, end?: string) {
    for (let index = min; index <= max; index++) {
        let field: pdf.PDFField;

        try {
            field = form.getField(`${pre}${index}${end || ""}`);
        } catch (_error) {
            field = form.getField(`${group}_${index}${end || ""}`);
        }

        const acroField = field.acroField;
        const parent = acroField.getParent();
        if (parent && group) {
            parent.setPartialName(`${group}_${index}`);
            acroField.setPartialName(neww);
        }
        else {
            acroField.setPartialName(`${neww}_${index}`);
        }
    }
}

function createCheckBoxes(name: string, newName: string, adjust: number) {
    for (let index = 1; index <= 10; index++) {
        const origin = form.getCheckBox(`${name}_${index}`);
        const field = form.createCheckBox(`${newName}_${index}`);

        const position = (<pdf.PDFArray>origin.acroField.dict.get(pdf.PDFName.of("Rect"))).asRectangle();

        field.addToPage(pdfDoc.getPage(0), {
            x: position.x,
            y: position.y + adjust,
            width: position.width,
            height: position.height
        });

        field.updateAppearances(() => {
            return { on: [...checkBoxDrawing, ...checkMarkDrawing], off: [...checkBoxDrawing] };
        });
    }
}

const pdfDoc = await pdf.PDFDocument.load(await Deno.readFile("./pdf/original.pdf"));

const form = pdfDoc.getForm();

form.getField('Nome').acroField.setPartialName("name");
form.getField('Geração_dropdown').acroField.setPartialName("generation");

const clanDropdown = form.getDropdown('Clã_dropdown');
clanDropdown.acroField.setPartialName("clan");
clanDropdown.setOptions(['  ',
'Banu Haqim',
'Brujah',
'Caitiff',
'Gangrel',
'Hecata',
'Lasombra',
'Malkavianos',
'Nosferatu',
'O Ministério',
'Ravnos',
'Salubri',
'Sangue-Ralo',
'Toreador',
'Tremere',
'Tzimisce',
'Ventrue']);


form.getField('Disciplina_dropdown#1.0.0').acroField.getParent()?.getParent()?.setPartialName("discipline");

for (const suffix of [".0.0", ".0.1", ".0.2", ".1.0", ".1.1", ".1.2"]) {
    const dropdown = form.getDropdown(`discipline${suffix}`);
    dropdown.disableEditing();
    dropdown.setOptions(['  ', 
    'Alquimia Sangue-Ralo', 
    'Animalismo', 
    'Auspícios', 
    'Celeridade', 
    'Dominação',
    'Feitiçaria de Sangue', 
    'Fortitude',
    'Oblívio', 
    'Ofuscação', 
    'Potência', 
    'Presença', 
    'Proteanismo']);
}

for (let index = 1; index <= 5; index++) {
    form.getField(`Disc${index}.0.0`).acroField.getParent()?.getParent()?.setPartialName(`discipline_${index}`);
}

editRange(form, "PotSan", "low", 1, 5, "bloodPotency", ".0");
editRange(form, "PotSan", "high", 1, 5, "bloodPotency", ".1");

const experienceTotal = form.getField('XP.0').acroField;
experienceTotal.setPartialName("total");
form.getField('XP.1').acroField.setPartialName("spent");
experienceTotal!.getParent()!.setPartialName("experience");

editRange(form, "For", "strength", 1, 5);
editRange(form, "Des", "dexterity", 1, 5);
editRange(form, "Vig", "stamina", 1, 5);

editRange(form, "Car", "charisma", 1, 5);
editRange(form, "Man", "manipulation", 1, 5);
editRange(form, "Aut", "composure", 1, 5);

editRange(form, "Int", "intelligence", 1, 5);
editRange(form, "Rac", "wits", 1, 5);
editRange(form, "Det", "resolve", 1, 5);

editRange(form, "HF", "athletics", 1, 5, "physical", ".2");
editRange(form, "HF", "brawl", 1, 5, "physical", ".3");
editRange(form, "HF", "craft", 1, 5, "physical", ".7");
editRange(form, "HF", "drive", 1, 5, "physical", ".4");
editRange(form, "HF", "firearms", 1, 5, "physical", ".1");
editRange(form, "HF", "melee", 1, 5, "physical", ".0");
editRange(form, "HF", "larceny", 1, 5, "physical", ".6");
editRange(form, "HF", "stealth", 1, 5, "physical", ".5");
editRange(form, "HF", "survival", 1, 5, "physical", ".8");

editRange(form, "HS", "animalKen", 1, 5, "social", ".0");
editRange(form, "HS", "etiquette", 1, 5, "social", ".1");
editRange(form, "HS", "insight", 1, 5, "social", ".7");
editRange(form, "HS", "intimidation", 1, 5, "social", ".2");
editRange(form, "HS", "leadership", 1, 5, "social", ".3");
editRange(form, "HS", "performance", 1, 5, "social", ".5");
editRange(form, "HS", "persuasion", 1, 5, "social", ".6");
editRange(form, "HS", "streetwise", 1, 5, "social", ".4");
editRange(form, "HS", "subterfuge", 1, 5, "social", ".8");

editRange(form, "HM", "academics", 1, 5, "mental", ".1");
editRange(form, "HM", "awareness", 1, 5, "mental", ".6");
editRange(form, "HM", "finance", 1, 5, "mental", ".2");
editRange(form, "HM", "investigation", 1, 5, "mental", ".3");
editRange(form, "HM", "medicine", 1, 5, "mental", ".4");
editRange(form, "HM", "occult", 1, 5, "mental", ".5");
editRange(form, "HM", "politics", 1, 5, "mental", ".7");
editRange(form, "HM", "science", 1, 5, "mental", ".0");
editRange(form, "HM", "technology", 1, 5, "mental", ".8");

editRange(form, "Vit", "health_aggravated", 1, 10);
editRange(form, "FV", "willpower_aggravated", 1, 10);
editRange(form, "Hum", "humanity_total", 1, 10);
editRange(form, "Fom", "hunger", 1, 5);

createCheckBoxes("health_aggravated", "health_superficial", -10);
createCheckBoxes("willpower_aggravated", "willpower_superficial", -10);
createCheckBoxes("humanity_total", "humanity_stains", 10);

await Deno.writeFile("./pdf/template.pdf", await pdfDoc.save({ updateFieldAppearances: false }));

form.getFields().forEach(field => {
    const type = field.constructor.name;
    const name = field.getName();
    console.log(`${type}: ${name}`);
});