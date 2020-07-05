import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { MessageEmbed } from "katana/mod.ts";
import { bot } from "../bot.ts";
import { labels } from "../i18n/labels.ts";

export function setDifficultyButton(reaction: MessageReaction, difficulty: number) {
    bot.difficulty = difficulty;  
    bot.outputChannel.send(new MessageEmbed()
    .setTitle(labels.storytellerChangeDifficulty)
    .addField(labels.difficulty, `**${bot.difficulty}**`, true)
    //Cinza
    .setColor(9807270)); 
}