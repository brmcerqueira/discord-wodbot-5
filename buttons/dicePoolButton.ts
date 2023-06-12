import { DicePool } from "../dicePools.ts";
import { rollHelper } from "../utils/rollHelper.ts";
import { config } from "../config.ts";
import { characterManager } from "../characterManager.ts";
import { botData } from "../botData.ts";
import { MessageReaction } from "../deps.ts";

export async function dicePoolButton(reaction: MessageReaction, dicePool: DicePool) {  
    for (const user of await reaction.users.collection()) {
        const userId = user[0];
        const spreadSheetId = config.storytellerId == userId 
        ? botData.storytellerSpreadSheetId
        : config.playerCharacters[userId];
        if (spreadSheetId) { 
            const character = characterManager.characters[spreadSheetId];
            const result = dicePool.action(character);
            await rollHelper(botData.outputChannel, 
                userId, 
                result.dices, 
                character.hunger, 
                result.difficulty, 
                dicePool.description);
        } 
    }
}