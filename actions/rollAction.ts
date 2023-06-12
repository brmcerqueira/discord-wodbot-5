import { Message } from "../deps.ts";
import { rollHelper } from "../utils/rollHelper.ts";

export async function rollAction(message: Message, matchArray: RegExpMatchArray[]) {
    for(const match of matchArray) {
        if (match.groups) {
            await rollHelper(
                message.channel, 
                message.author.id, 
                parseInt(match.groups.dices), 
                match.groups.hunger ? parseInt(match.groups.hunger) : 0, 
                match.groups.difficulty ? parseInt(match.groups.difficulty) : 1, 
                match.groups.description);     
        }      
    }
}