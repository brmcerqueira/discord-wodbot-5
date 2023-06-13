import { botData } from "../botData.ts";
import { characterManager } from "../characterManager.ts";
import { MessageReaction, User } from "../deps.ts";

export async function decreaseExperienceButton(reaction: MessageReaction, user: User, value: number) {  
    await characterManager.updateExperience(botData.storytellerSpreadSheetId, exp => exp - value);
}