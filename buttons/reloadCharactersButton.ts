import { characterManager } from "../characterManager.ts";
import { Bot } from "../deps.ts";
import { MessageReaction } from "../messageReaction.ts";

export function reloadCharactersButton(bot: Bot, reaction: MessageReaction, value: string) {
    characterManager.load();
}