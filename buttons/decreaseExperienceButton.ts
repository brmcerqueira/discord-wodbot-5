import { botData } from "../botData.ts";
import { characterManager } from "../characterManager.ts";
import { Bot } from "../deps.ts";
import { MessageReaction } from "../messageReaction.ts";

export function decreaseExperienceButton(bot: Bot, reaction: MessageReaction, value: number) {  
    characterManager.updateExperience(botData.storytellerSpreadSheetId, exp => exp - value);
}