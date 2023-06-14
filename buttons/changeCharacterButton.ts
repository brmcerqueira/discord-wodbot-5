import { labels } from "../i18n/labels.ts";
import * as characterManager from "../characterManager.ts";
import { logger } from "../logger.ts";
import * as botData from "../botData.ts";
import { Interaction } from "../deps.ts";

export async function changeCharacterButton(_interaction: Interaction, spreadSheetId: string) {
    botData.setStorytellerSpreadSheetId(spreadSheetId);
    logger.info(labels.changeCharacterSuccess, characterManager.characters[spreadSheetId].name);
}