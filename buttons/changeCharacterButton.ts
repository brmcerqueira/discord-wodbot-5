import * as botData from "../botData.ts";
import { Interaction } from "../deps.ts";

export async function changeCharacterButton(_interaction: Interaction, id: string) {
    await botData.setStorytellerCurrentCharacterId(id);
}