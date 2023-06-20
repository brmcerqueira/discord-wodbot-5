import { roll } from "../diceRollManager.ts";
import * as botData from "../botData.ts";
import { AllMessageOptions, ButtonStyle, MessageComponentData, MessageComponentType, TextChannel } from "../deps.ts";
import { rollEmbed } from "./rollEmbed.ts";
import { ReRoll } from "../command.ts";

export async function rollHelper(channel: TextChannel,
    authorId: string,
    dices: number,
    hunger: number,
    difficulty: number,
    description: string | undefined): Promise<void> {

    if (botData.difficulty) {
        difficulty = botData.difficulty;
        botData.setDifficulty(null);
    }

    let modifier = 0;

    if (botData.modifier) {
        modifier = botData.modifier;
        botData.setModifier(null);
    }

    dices += modifier;

    const result = roll(dices, hunger, difficulty, modifier);

    const margin = dices - hunger;

    const embed = rollEmbed(result, authorId, description);

    const options: AllMessageOptions = {
        embeds: [embed]
    };

    if (margin > 0) {
        const scopes = [ReRoll];

        const buttons: MessageComponentData[] = [{
            type: MessageComponentType.Button,
            label: '',
            emoji: {
                name: '1️⃣'
            },
            style: ButtonStyle.SECONDARY,
            customID: botData.buildId(1, ...scopes)
        }];

        options.components = [{
            type: MessageComponentType.ActionRow,
            components: buttons
        }];

        if (margin >= 2) {
            buttons.push({
                type: MessageComponentType.Button,
                label: '',
                emoji: {
                    name: '2️⃣'
                },
                style: ButtonStyle.SECONDARY,
                customID: botData.buildId(2, ...scopes)
            });
        }

        if (margin >= 3) {
            buttons.push({
                type: MessageComponentType.Button,
                label: '',
                emoji: {
                    name: '3️⃣'
                },
                style: ButtonStyle.SECONDARY,
                customID: botData.buildId(3, ...scopes)
            })
        }
    }

    await channel.send(options);

    botData.lastRolls[authorId.toString()] = {
        embed: embed,
        result: result
    };
}