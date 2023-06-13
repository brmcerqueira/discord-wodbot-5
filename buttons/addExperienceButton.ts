import * as botData from "../botData.ts";
import * as characterManager from "../characterManager.ts";
import { MessageReaction, User } from "../deps.ts";

export async function addExperienceButton(_reaction: MessageReaction, _user: User, value: number) {  
    await characterManager.updateExperience(botData.storytellerSpreadSheetId, exp => exp + value);
}