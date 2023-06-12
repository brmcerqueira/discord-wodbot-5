import { roll } from "../diceRollManager.ts";
import { botData } from "../botData.ts";
import { TextChannel } from "../deps.ts";
import { rollEmbed } from "./rollEmbed.ts";

export async function rollHelper(channel: TextChannel, 
    authorId: string, 
    dices: number, 
    hunger: number, 
    difficulty: number, 
    description: string | undefined): Promise<void> {

    if (botData.difficulty) {
        difficulty = botData.difficulty;
        botData.difficulty = null;
    }

    const result = roll(dices, hunger, difficulty);

    const message = await channel.send({
        embeds: [rollEmbed(result, authorId, description)]
    })

    botData.lastRolls[authorId.toString()] = {
        messageId: message.id,
        result: result
    };
    
    const margin = dices - hunger;

    if (margin > 0) {
        await message.addReaction('1️⃣');
  
        if (margin >= 2) { 
            await message.addReaction('2️⃣');   
        } 
        
        if (margin >= 3) { 
            await message.addReaction('3️⃣');
        }
    }
}