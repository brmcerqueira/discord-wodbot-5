import { characterManager } from "../characterManager.ts";
import { MessageReaction } from "../deps.ts";

export async function reloadCharactersButton(reaction: MessageReaction, value: string) {
    await characterManager.load();
}