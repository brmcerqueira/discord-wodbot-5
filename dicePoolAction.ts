import { Logger } from "log4deno/index.ts";
import { Message, MessageEmbed } from "katana/mod.ts";
import { roll } from "./dicePool.ts";

export function dicePoolAction(logger: Logger, message: Message, matchArray: RegExpMatchArray[]) {
    logger.info(message.content);

    const embed = new MessageEmbed()
    .setDescription("text")
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

            let resultRoll = roll(parseInt(result.groups.dices), 
            result.groups.hunger ? parseInt(result.groups.hunger) : 0, 
            result.groups.difficulty ? parseInt(result.groups.difficulty) : 1);
            
            embed.addField("Successes", resultRoll.successes.toString(), true); 
            embed.addField("Dices", resultRoll.dices.map(d => `${d.value} - ${d.isHunger}`).join(','), true); 
            embed.addField("Status", resultRoll.status.toString());
        }      
    }

    message.channel.send(embed);
}