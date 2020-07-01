import { Message } from "katana/mod.ts";
import { rollHelper } from "../utils/rollHelper.ts";

export function rollAction(message: Message, matchArray: RegExpMatchArray[]) {
    for(let match of matchArray) {
        if (match.groups) {
            rollHelper(message.channel, 
                message.user.id, 
                parseInt(match.groups.dices), 
                match.groups.hunger ? parseInt(match.groups.hunger) : 0, 
                match.groups.difficulty ? parseInt(match.groups.difficulty) : 1, 
                match.groups.description);     
        }      
    }
}