import { Logger } from "log4deno/index.ts";
import { Message, MessageEmbed } from "katana/mod.ts";
import { roll } from "./dicePool.ts";

export function dicePoolAction(logger: Logger, message: Message, matchArray: RegExpMatchArray[]) {
    logger.info(message.content);

    let text = "";
    for (let index = 0; index < 10; index++) {
        text += `[Jogada ${index}](https://www.youtube.com/)\n`;
    }

    const embed = new MessageEmbed()
    .setDescription(text)
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

            let resultRoll = roll(parseInt(result.groups.dices), 10, true);
            embed.addField("Successes", resultRoll.successes.toString()); 
            embed.addField("Dices", resultRoll.dices.join(',')); 
            embed.addField("IsCriticalFailure", resultRoll.isCriticalFailure ? "Sim" : "Não");
        }      
    }

    message.channel.send(embed);
}