import * as botData from "../botData.ts";
import * as characterManager from "../characterManager.ts";
import { Interaction } from "../deps.ts";

export async function decreaseExperienceButton(_interaction: Interaction, value: number) {  
    await characterManager.updateExperience(botData.storytellerSpreadSheetId, exp => exp - value);
}