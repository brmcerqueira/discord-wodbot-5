import * as characterManager from "../characterManager.ts";
import { MessageReaction, User } from "../deps.ts";

export async function reloadCharactersButton(_reaction: MessageReaction, _user: User, _value: string) {
    await characterManager.load();
}