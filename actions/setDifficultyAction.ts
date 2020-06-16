import { Logger } from "log4deno/index.ts";
import { Message, MessageEmbed } from "katana/mod.ts";
import { labels } from "../i18n/labels.ts";
import { difficulty } from "../rollManager.ts";
import { ConfigDef } from "../configDef.ts";

export function setDifficultyAction(logger: Logger, config: ConfigDef, message: Message, matchArray: RegExpMatchArray[]) {
    for(let match of matchArray) {
        if (match.groups && config.storytellerId == message.user.id) {
            difficulty.current = parseInt(match.groups.difficulty);  
            message.channel.send(new MessageEmbed()
            .setTitle(labels.storytellerChangeDifficulty)
            .addField(labels.difficulty, `**${difficulty.current}**`, true)
            //Cinza
            .setColor(9807270));   
        }      
    }
}