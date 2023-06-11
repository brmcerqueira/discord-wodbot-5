import { DicePool } from "../dicePools.ts";
import { rollHelper } from "../utils/rollHelper.ts";
import { config } from "../config.ts";
import { characterManager } from "../characterManager.ts";
import { MessageReaction } from "../messageReaction.ts";
import { botData } from "../botData.ts";
import { Bot } from "../deps.ts";

export function dicePoolButton(bot: Bot, reaction: MessageReaction, dicePool: DicePool) {  
    const spreadSheetId = config.storytellerId == reaction.userId 
    ? botData.storytellerSpreadSheetId
    : config.playerCharacters[reaction.userId.toString()];
    if (spreadSheetId) { 
        const character = characterManager.characters[spreadSheetId];
        const result = dicePool.action(character);
        rollHelper(bot,
            config.outputChannelId, 
            reaction.userId, 
            result.dices, 
            character.hunger, 
            result.difficulty, 
            dicePool.description);
    }  
}