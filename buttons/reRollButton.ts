import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { reRollHelper } from "../utils/reRollHelper.ts";

export function reRollButton(reaction: MessageReaction, isAdd: boolean, value: number) {
    reaction.users.forEach(user => {       
        reRollHelper(reaction.message.channel, user.id, value);
    });
}