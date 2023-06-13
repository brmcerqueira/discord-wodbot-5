import { labels } from "../i18n/labels.ts";
import * as characterManager from "../characterManager.ts";
import { logger } from "../logger.ts";
import * as botData from "../botData.ts";
import { MessageReaction, User } from "../deps.ts";

export async function changeCharacterButton(_reaction: MessageReaction, _user: User, spreadSheetId: string) {
    botData.setStorytellerSpreadSheetId(spreadSheetId);
    logger.info(labels.changeCharacterSuccess, characterManager.characters[spreadSheetId].name);
}