import { roll } from "../diceRollManager.ts";
import { botData } from "../botData.ts";
import { Bot, transformEmbed } from "../deps.ts";
import { rollEmbed } from "./rollEmbed.ts";

export async function rollHelper(bot: Bot, 
    channelId: bigint, 
    authorId: bigint, 
    dices: number, 
    hunger: number, 
    difficulty: number, 
    description: string | undefined): Promise<void> {

    if (botData.difficulty) {
        difficulty = botData.difficulty;
        botData.difficulty = null;
    }

    const result = roll(dices, hunger, difficulty);

    const rollMessage = await bot.helpers.sendMessage(channelId, {
        embeds: [transformEmbed(bot, rollEmbed(result, authorId, description))]
    })

    botData.lastRolls[authorId.toString()] = {
        messageId: rollMessage.id,
        result: result
    };
    
    const margin = dices - hunger;

    if (margin > 0) {
        const reactions = ['1️⃣'];
  
        if (margin >= 2) { 
            reactions.push('2️⃣');   
        } 
        
        if (margin >= 3) { 
            reactions.push('3️⃣');
        }

        await bot.helpers.addReactions(channelId, channelId, reactions);
    }
}