import { Message, MessageEmbed } from "katana/mod.ts";
import { labels } from "../i18n/labels.ts";
import { config } from "../config.ts";
import { bot } from "../bot.ts";

export function setDifficultyAction(message: Message, matchArray: RegExpMatchArray[]) {
    for(let match of matchArray) {
        if (match.groups && config.storytellerId == message.user.id) {
            bot.difficulty = parseInt(match.groups.difficulty);  
            message.channel.send(new MessageEmbed()
            .setTitle(labels.storytellerChangeDifficulty)
            .addField(labels.difficulty, `**${bot.difficulty}**`, true)
            //Cinza
            .setColor(9807270));   
        }      
    }
}