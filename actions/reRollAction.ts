import { Message } from "katana/mod.ts";
import { reRollHelper } from "../utils/reRollHelper.ts";

export function reRollAction(message: Message, matchArray: RegExpMatchArray[]) {
    for(let match of matchArray) {
        if (match.groups) {
            reRollHelper(message.channel, message.user.id, parseInt(match.groups.dices));      
        }      
    }
}