import { labels } from "../i18n/labels.ts";
import { characterManager } from "../characterManager.ts";
import { logger } from "../logger.ts";
import { botData } from "../botData.ts";
import { MessageReaction, User } from "../deps.ts";

export async function changeCharacterButton(reaction: MessageReaction, user: User, spreadSheetId: string) {
    botData.storytellerSpreadSheetId = spreadSheetId;
    logger.info(labels.changeCharacterSuccess, characterManager.characters[spreadSheetId].name);
}