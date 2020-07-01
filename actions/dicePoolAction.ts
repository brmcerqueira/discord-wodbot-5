import { Message } from "katana/mod.ts";
import { roll } from "../diceRollManager.ts";
import PromiseQueue from "../utils/promiseQueue.ts";
import { rollMessageEmbed } from "../utils/rollMessageEmbed.ts";
import { bot } from "../bot.ts";

export function dicePoolAction(message: Message, matchArray: RegExpMatchArray[]) {
    for(let match of matchArray) {
        if (match.groups) {
            let dif = 1;

            if (bot.difficulty) {
                dif = bot.difficulty;
                bot.difficulty = null;
            }
            else if (match.groups.difficulty) {
                dif = parseInt(match.groups.difficulty);
            }

            let dices = parseInt(match.groups.dices);
            let hunger = match.groups.hunger ? parseInt(match.groups.hunger) : 0;

            let result = roll(dices, hunger, dif);

            message.channel.send(rollMessageEmbed(result, message.user.id, match.groups.description)).then(rollMessage => {
                bot.lastRolls[message.user.id] = {
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
    }
}