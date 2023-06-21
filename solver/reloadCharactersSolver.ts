import * as characterManager from "../characterManager.ts";
import { Interaction } from "../deps.ts";

export async function reloadCharactersSolver(_interaction: Interaction, _value: string) {
    await characterManager.load();
}