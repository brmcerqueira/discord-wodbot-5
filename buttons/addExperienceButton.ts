import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { bot } from "../bot.ts";
import { characterManager } from "../characterManager.ts";

export function addExperienceButton(reaction: MessageReaction, value: number) {  
    characterManager.updateExperience(bot.storytellerSpreadSheetId, exp => exp + value);
}