import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { bot } from "../bot.ts";
import { characterManager } from "../characterManager.ts";

export function decreaseExperienceButton(reaction: MessageReaction, value: number) {  
    characterManager.updateExperience(bot.storytellerSpreadSheetId, exp => exp - value);
}