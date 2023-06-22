import { DicePool } from "../dicePools.ts";
import { config } from "../config.ts";
import * as characterManager from "../characterManager.ts";
import * as botData from "../botData.ts";
import { Interaction } from "../deps.ts";
import { sendRoll } from "../utils/sendRoll.ts";

export async function dicePoolSolver(interaction: Interaction, dicePool: DicePool) {
    const id = config.storytellerId == interaction.user.id
        ? botData.storytellerCurrentCharacterId
        : characterManager.users[interaction.user.id];
    if (id) {
        const character = characterManager.characters[id];
        const result = dicePool.build(character);
        await sendRoll(async m => {
            await botData.outputChannel.send(m);
        }, interaction.guild!.id, interaction.user.id, result.dices, character.hunger, 
        result.difficulty, result.modifier, dicePool.description);
    }
}