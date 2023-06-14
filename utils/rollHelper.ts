import { roll } from "../diceRollManager.ts";
import * as botData from "../botData.ts";
import { AllMessageOptions, ButtonStyle, MessageComponentData, MessageComponentType, TextChannel } from "../deps.ts";
import { rollEmbed } from "./rollEmbed.ts";
import { MessageScope } from "../messageScope.ts";

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

    const result = roll(dices, hunger, difficulty);

    const margin = dices - hunger;

    const options: AllMessageOptions = {
        embeds: [
            rollEmbed(result, authorId, description)
        ]
    };

    if (margin > 0) {
        const buttons: MessageComponentData[] = [{
            type: MessageComponentType.Button,
            label: '',
            emoji: {
                name: '1️⃣'
            },
            style: ButtonStyle.SECONDARY,
            customID: "1"
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
                customID: "2"
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
                customID: "3"
            })
        }
    }

    const message = await channel.send(options);

    botData.addMessageScope(message.id, [MessageScope.ReRoll]);

    botData.lastRolls[authorId.toString()] = {
        message: message,
        result: result
    };
}