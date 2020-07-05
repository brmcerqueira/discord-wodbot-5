import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { bot } from "../bot.ts";
import { MessageEmbed } from "katana/mod.ts";
import { labels } from "../i18n/labels.ts";
import { characterManager } from "../characterManager.ts";

export function changeCharacterButton(reaction: MessageReaction, spreadSheetId: string) {
    bot.storytellerSpreadSheetId = spreadSheetId;  
    bot.outputChannel.send(new MessageEmbed()
    .setTitle(labels.changeCharacterSuccess)
    .addField(labels.character, `**${characterManager.characters[spreadSheetId].name}**`, true)
    //Cinza
    .setColor(9807270)); 
}