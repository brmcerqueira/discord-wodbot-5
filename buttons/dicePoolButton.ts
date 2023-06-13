import { DicePool } from "../dicePools.ts";
import { rollHelper } from "../utils/rollHelper.ts";
import { config } from "../config.ts";
import { characterManager } from "../characterManager.ts";
import { botData } from "../botData.ts";
import { MessageReaction, User } from "../deps.ts";

export async function dicePoolButton(reaction: MessageReaction, user: User, dicePool: DicePool) {  
    const spreadSheetId = config.storytellerId == user.id 
    ? botData.storytellerSpreadSheetId
    : config.playerCharacters[user.id];
    if (spreadSheetId) { 
        const character = characterManager.characters[spreadSheetId];
        const result = dicePool.action(character);
        await rollHelper(botData.outputChannel, 
            user.id, 
            result.dices, 
            character.hunger, 
            result.difficulty, 
            dicePool.description);
    } 
}