import * as botData from "../botData.ts";
import { Interaction } from "../deps.ts";

export async function changeCharacterButton(_interaction: Interaction, spreadSheetId: string) {
    await botData.setStorytellerSpreadSheetId(spreadSheetId);
}