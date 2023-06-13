import { characterManager } from "../characterManager.ts";
import { MessageReaction, User } from "../deps.ts";

export async function reloadCharactersButton(reaction: MessageReaction, user: User, value: string) {
    await characterManager.load();
}