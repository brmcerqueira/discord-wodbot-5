import { Client, Message, TextChannel } from "katana/mod.ts";
import { labels } from "./i18n/labels.ts";
import { reRollAction } from "./actions/reRollAction.ts";
import { setDifficultyAction } from "./actions/setDifficultyAction.ts";
import { config } from "./config.ts";
import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { reRollButton } from "./buttons/reRollButton.ts";
import { googleSheets } from "./googleSheets.ts";
import { characterManager } from "./characterManager.ts";
import { logger } from "./logger.ts";
import { discord } from "./discord.ts";
import { dicePools } from "./dicePools.ts";
import PromiseQueue from "./utils/promiseQueue.ts";
import { dicePoolButton } from "./buttons/dicePoolButton.ts";
import { rollAction } from "./actions/rollAction.ts";
import { bot } from "./bot.ts";

const client = new Client();

client.on('ready', () => {
  logger.info(labels.welcome);
  bot.dicePools.viewChannel = client.channels.get(config.dicePools.viewChannelId);
  bot.dicePools.outputChannel = client.channels.get(config.dicePools.outputChannelId);
  discord.deleteAllMessages(config.dicePools.viewChannelId).then(() => {
    let promiseQueue = new PromiseQueue();
    Object.keys(dicePools).forEach(key => 
      promiseQueue.add(() => bot.dicePools.viewChannel.send(`__**${dicePools[key].name}**__`).then(m => m.react(key))));
    promiseQueue.resume();
  });
});

type RegExpAction = {
  regex: RegExp,
  action: (message: Message, matchArray: RegExpMatchArray[]) => void
}

type EmojiButton = {
  emojis: { [key: string]: any },
  button: (reaction: MessageReaction, isAdd: boolean, value: any) => void,
  addOrRemoveScope?: boolean
}

const regExpActions: RegExpAction[] = [
  {
    regex: /^%(?<dices>[1-9]?\d)\s*(\!(?<hunger>[1-5]))?\s*(\*(?<difficulty>[2-9]))?\s*(?<description>.*)/g,
    action: rollAction
  },
  {
    regex: /^%rr (?<dices>[1-3])/g,
    action: reRollAction
  },
  {
    regex: /^%dif (?<difficulty>[1-9])/g,
    action: setDifficultyAction
  }
];

const emojiButtons: EmojiButton[] = [
  {
    emojis: {
      '1️⃣': 1,
      '2️⃣': 2,
      '3️⃣': 3
    },
    button: reRollButton
  },
  {
    emojis: dicePools,
    button: dicePoolButton
  }
];

client.on('message', (message: Message) => {
  for(let regExpAction of regExpActions) {
    let resultMatchAll = [...message.content.matchAll(regExpAction.regex)];
    if (resultMatchAll.length > 0) {
      logger.info(message.user.id, message.content, resultMatchAll);
      regExpAction.action(message, resultMatchAll);
      break;
    }
  }
});

function emojiButtonCallback(isAdd: boolean, reaction: MessageReaction) {
  if (!reaction.me) {
    let name = <string> reaction.emoji.name;
    for(let emojiButton of emojiButtons) {
      let value = emojiButton.emojis[name];      
      if (value && (emojiButton.addOrRemoveScope == undefined 
      || (emojiButton.addOrRemoveScope && isAdd) 
      || (!emojiButton.addOrRemoveScope && !isAdd))) {
        logger.info(name);
        emojiButton.button(reaction, isAdd, value);  
        break;
      }
    }
  }
}

client.on('messageReactionAdd', (reaction: MessageReaction) => { 
  emojiButtonCallback(true, reaction);
});

client.on('messageReactionRemove', (reaction: MessageReaction) => { 
  emojiButtonCallback(false, reaction);
});

googleSheets.auth().then(() => {
  discord.setToken(config.discordToken);
  client.login(config.discordToken);
});