import * as botData from "../botData.ts";
import { Embed, MessageReaction, User } from "../deps.ts";
import { labels } from "../i18n/labels.ts";

export async function setDifficultyButton(_reaction: MessageReaction, _user: User, difficulty: number) {
    botData.setDifficulty(difficulty);  
    await botData.outputChannel.send(new Embed({
        title: labels.storytellerChangeDifficulty,
        //Cinza
        color: 9807270,
        fields: [{
            name: labels.difficulty,
            value: `**${botData.difficulty}**`,
            inline: true
        }]
    }));
}