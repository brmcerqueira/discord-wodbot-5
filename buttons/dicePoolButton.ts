import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { DicePool } from "../dicePools.ts";
import { rollHelper } from "../utils/rollHelper.ts";
import { config } from "../config.ts";
import { characterManager } from "../characterManager.ts";
import { bot } from "../bot.ts";

export function dicePoolButton(reaction: MessageReaction, isAdd: boolean, dicePool: DicePool) {  
    reaction.users.forEach(user => {   
        let sheets = config.characters[user.id];
        let spreadSheetId = sheets && sheets[0] ? sheets[0] : null;
        if (spreadSheetId) {
            characterManager.get(spreadSheetId).then(character => {
                let result = dicePool.action(character);
                rollHelper(bot.dicePools.outputChannel, 
                    user.id, 
                    result.dices, 
                    character.hunger, 
                    result.difficulty, 
                    dicePool.description);
            });           
        }   
    });
}