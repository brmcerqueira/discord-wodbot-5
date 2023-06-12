import { botData } from "../botData.ts";
import { characterManager } from "../characterManager.ts";
import { MessageReaction } from "../deps.ts";

export async function decreaseExperienceButton(reaction: MessageReaction, value: number) {  
    await characterManager.updateExperience(botData.storytellerSpreadSheetId, exp => exp - value);
}