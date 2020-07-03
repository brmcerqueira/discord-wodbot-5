import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { characterManager } from "../characterManager.ts";

export function reloadCharactersButton(reaction: MessageReaction, value: string) {
    characterManager.loadCharactersPromiseQueue().resume();
}