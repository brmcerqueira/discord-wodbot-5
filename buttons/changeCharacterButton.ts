import { labels } from "../i18n/labels.ts";
import { characterManager } from "../characterManager.ts";
import { logger } from "../logger.ts";
import { format } from "../utils/format.ts";
import { botData } from "../botData.ts";
import { MessageReaction } from "../deps.ts";

export async function changeCharacterButton(reaction: MessageReaction, spreadSheetId: string) {
    botData.storytellerSpreadSheetId = spreadSheetId;
    logger.info(format(labels.changeCharacterSuccess, characterManager.characters[spreadSheetId].name))
}