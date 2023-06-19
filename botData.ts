import { RollResult } from "./diceRollManager.ts";
import { config } from "./config.ts";
import { Embed, Message, TextChannel, User } from "./deps.ts";
import { labels } from "./i18n/labels.ts";
import * as characterManager from "./characterManager.ts";
import { CommandScope, Storyteller, allScopes } from "./command.ts";
import { logger } from "./logger.ts";
import { Character } from "./character.ts";

export type CustomId = { index: number, scopes?: CommandScope[] };

export const lastRolls: {
    [userId: string]: {
        embed: Embed,
        result: RollResult
    }
} = {};

export function checkMessageScope(user: User, customId: CustomId, scopes: CommandScope[]): boolean {
    if (scopes.length > 0) {
        for (const scope of scopes) {
            if ((scope.value == Storyteller.value && user.id != config.storytellerId) 
            || (scope.value != Storyteller.value && (!customId.scopes || customId.scopes.indexOf(scope) == -1))) {
                return false;
            }
        }
    }

    return true;
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

export let storytellerCurrentCharacterId: string = "";

export async function setStorytellerCurrentCharacterId(value: string) {
    storytellerCurrentCharacterId = value;
    const character = characterManager.characters[storytellerCurrentCharacterId];
    await currentCharacterMessage.edit(buildCurrentCharacterEmbed(character.name));
    logger.info(labels.changeCharacterSuccess, character.name);
}

export function parseCustomId(id: string): CustomId {
    const split = id.split('_', 2);

    if (split.length == 2) {
        const bit = parseInt(split[0]);
    
        return { 
            index: parseInt(split[1]),
            scopes: allScopes.filter(s => (bit & s.value) === s.value)
        };
    }

    return { 
        index: parseInt(id) 
    };
}

export function buildId(index: number, ...scopes: CommandScope[]): string {
    return scopes.length > 0 ? `${scopes.reduce((total, current) => total + current.value, 0)}_${index}` : index.toString();
}

export async function buildCurrentCharacterMessage(storytellerChannel: TextChannel) {
    storytellerCurrentCharacterId = Object.keys(characterManager.characters)[0];
    currentCharacterMessage = await storytellerChannel.send(buildCurrentCharacterEmbed(
        storytellerCurrentCharacterId != "" ? characterManager.characters[storytellerCurrentCharacterId]!.name : ""));
}

export function buildCurrentCharacterEmbed(name: string): Embed {
    return new Embed({
        title: labels.currentCharacter,
        description: name,
        //Cinza
        color: 9807270
    })
}