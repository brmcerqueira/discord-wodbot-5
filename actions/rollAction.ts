import { Bot, Message } from "../deps.ts";
import { rollHelper } from "../utils/rollHelper.ts";

export function rollAction(bot: Bot, message: Message, matchArray: RegExpMatchArray[]) {
    for(const match of matchArray) {
        if (match.groups) {
            rollHelper(bot,
                message.channelId, 
                message.authorId, 
                parseInt(match.groups.dices), 
                match.groups.hunger ? parseInt(match.groups.hunger) : 0, 
                match.groups.difficulty ? parseInt(match.groups.difficulty) : 1, 
                match.groups.description);     
        }      
    }
}