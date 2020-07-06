import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { bot } from "../bot.ts";
import { labels } from "../i18n/labels.ts";
import { characterManager } from "../characterManager.ts";
import { logger } from "../logger.ts";
import { format } from "../utils/format.ts";

export function changeCharacterButton(reaction: MessageReaction, spreadSheetId: string) {
    bot.storytellerSpreadSheetId = spreadSheetId;
    logger.info(format(labels.changeCharacterSuccess, characterManager.characters[spreadSheetId].name))
}