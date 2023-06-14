import { DicePool } from "../dicePools.ts";
import { rollHelper } from "../utils/rollHelper.ts";
import { config } from "../config.ts";
import * as characterManager from "../characterManager.ts";
import * as botData from "../botData.ts";
import { Interaction } from "../deps.ts";

export async function dicePoolButton(interaction: Interaction, dicePool: DicePool) {  
    const spreadSheetId = config.storytellerId == interaction.user.id 
    ? botData.storytellerSpreadSheetId
    : config.playerCharacters[interaction.user.id];
    if (spreadSheetId) { 
        const character = characterManager.characters[spreadSheetId];
        const result = dicePool.action(character);
        await rollHelper(botData.outputChannel, 
            interaction.user.id, 
            result.dices, 
            character.hunger, 
            result.difficulty, 
            dicePool.description);
    } 
}