import * as botData from "../botData.ts";
import * as characterManager from "../characterManager.ts";
import { Interaction } from "../deps.ts";

export async function setHungerButton(_interaction: Interaction, value: number) {
  await characterManager.updateHunger(botData.storytellerSpreadSheetId, () => value);
}
