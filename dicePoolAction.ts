import { Logger } from "log4deno/index.ts";
import { Message, MessageEmbed } from "katana/mod.ts";

export function dicePoolAction(logger: Logger, message: Message, matchArray: RegExpMatchArray[]) {
    logger.info(message.content);

    const embed = new MessageEmbed()
    .setDescription('hello world')
    .setColor(13198335)
    .setTitle('This is an embed');

    for(let result of matchArray) {
        logger.info(result.groups);   
        if (result.groups) {
            for(let key of Object.keys(result.groups)) {
                if (result.groups[key]) {
                    embed.addField(key, result.groups[key]); 
                }            
            }
        }      
    }

    message.channel.send(embed);
}