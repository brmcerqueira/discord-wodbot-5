import { Message } from "katana/mod.ts";
import { roll } from "../dicePool.ts";
import { rollMessageEmbed } from "../rollMessageEmbed.ts";
import { rollManager, difficulty } from "../rollManager.ts";

export function dicePoolAction(message: Message, matchArray: RegExpMatchArray[]) {
    for(let match of matchArray) {
        if (match.groups) {
            let dif = 1;

            if (difficulty.current) {
                dif = difficulty.current;
                difficulty.current = null;
            }
            else if (match.groups.difficulty) {
                dif = parseInt(match.groups.difficulty);
            }

            let dices = parseInt(match.groups.dices);
            let hunger = match.groups.hunger ? parseInt(match.groups.hunger) : 0;

            let result = roll(dices, hunger, dif);

            rollManager[message.user.id] = result;

            let promise = message.channel.send(rollMessageEmbed(result, message.user.id, match.groups.description));

            let margin = dices - hunger;

            if (margin > 0) {
                promise.then(m => {
                    let promiseReact = m.react('1️⃣');

                    if (margin >= 2) {    
                        promiseReact = promiseReact.then(r => m.react('2️⃣'));  
                    } 
                    
                    if (margin >= 3) {    
                        promiseReact = promiseReact.then(r => m.react('3️⃣'));  
                    }
                });
            }
        }      
    }
}