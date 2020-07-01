import { roll } from "../diceRollManager.ts";
import PromiseQueue from "../utils/promiseQueue.ts";
import { rollMessageEmbed } from "../utils/rollMessageEmbed.ts";
import { bot } from "../bot.ts";
import { TextChannel } from "katana/mod.ts";

export function rollHelper(channel: TextChannel, 
    userId: string, 
    dices: number, 
    hunger: number, 
    difficulty: number, 
    description: string | undefined) {

    if (bot.difficulty) {
        difficulty = bot.difficulty;
        bot.difficulty = null;
    }

    let result = roll(dices, hunger, difficulty);

    channel.send(rollMessageEmbed(result, userId, description)).then(rollMessage => {
        bot.lastRolls[userId] = {
            messageId: rollMessage.id,
            result: result
        };
        
        let margin = dices - hunger;

        if (margin > 0) {
            let promiseQueue = new PromiseQueue();
                     
            promiseQueue.add(() => rollMessage.react('1️⃣'));

            if (margin >= 2) {    
                promiseQueue.add(() => rollMessage.react('2️⃣'));
            } 
            
            if (margin >= 3) { 
                promiseQueue.add(() => rollMessage.react('3️⃣'));  
            }

            promiseQueue.resume();
        }           
    }); 
}