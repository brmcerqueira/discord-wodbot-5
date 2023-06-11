import { labels } from "../i18n/labels.ts";
import { characterManager } from "../characterManager.ts";
import { logger } from "../logger.ts";
import { format } from "../utils/format.ts";
import { botData } from "../botData.ts";
import { MessageReaction } from "../messageReaction.ts";
import { Bot } from "../deps.ts";

export function changeCharacterButton(bot: Bot, reaction: MessageReaction, spreadSheetId: string) {
    botData.storytellerSpreadSheetId = spreadSheetId;
    logger.info(format(labels.changeCharacterSuccess, characterManager.characters[spreadSheetId].name))
}