import { RollResult } from "./diceRollManager.ts";
import { Embed, EmbedPayload, EmojiPayload, Message, TextChannel } from "./deps.ts";
import { labels } from "./i18n/labels.ts";
import * as characterManager from "./characterManager.ts";
import * as colors from "./colors.ts";
import { logger } from "./logger.ts";

export const lastRolls: {
    [userId: string]: {
        embed: EmbedPayload,
        result: RollResult
    }
} = {};

export const unlock: string[] = [];

type EmojiDictionary = {
    [guildId: string]: EmojiPayload
}

export const emojis: {
    bestial: EmojiDictionary
    critical: EmojiDictionary
    messy: EmojiDictionary
    noneBlack: EmojiDictionary
    noneRed: EmojiDictionary
    successBlack: EmojiDictionary
    successRed: EmojiDictionary
} = {
    bestial: {},
    critical: {},
    messy: {},
    noneBlack: {},
    noneRed: {},
    successBlack: {},
    successRed: {}
}

export let outputChannel: TextChannel;

let currentCharacterMessage: Message;

export function setOutputChannel(value: TextChannel) {
    outputChannel = value;
}

export let difficulty: number | null = null;

export function setDifficulty(value: number | null) {
    difficulty = value;
}

export let modifier: number | null = null;

export function setModifier(value: number | null) {
    modifier = value;
}

export let storytellerCurrentCharacterId: string = "";

export async function setStorytellerCurrentCharacterId(value: string) {
    storytellerCurrentCharacterId = value;
    const character = characterManager.characters[storytellerCurrentCharacterId];
    await currentCharacterMessage.edit(buildCurrentCharacterEmbed(character.name));
    logger.info(labels.changeCharacterSuccess, character.name);
}

export async function buildCurrentCharacterMessage(storytellerChannel: TextChannel) {
    storytellerCurrentCharacterId = Object.keys(characterManager.characters)[0];
    currentCharacterMessage = await storytellerChannel.send(buildCurrentCharacterEmbed(
        storytellerCurrentCharacterId != "" ? characterManager.characters[storytellerCurrentCharacterId]?.name : "-"));
}

export function buildCurrentCharacterEmbed(name: string): Embed {
    return new Embed({
        title: labels.currentCharacter,
        description: name,
        color: colors.Gray
    });
}