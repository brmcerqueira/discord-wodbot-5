import * as characterManager from "../characterManager.ts";
import { Interaction } from "../deps.ts";

export async function reloadCharactersButton(_interaction: Interaction, _value: string) {
    await characterManager.load();
}