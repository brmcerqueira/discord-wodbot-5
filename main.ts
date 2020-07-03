import { Client, Message, TextChannel, MessageEmbed } from "katana/mod.ts";
import { labels } from "./i18n/labels.ts";
import { reRollAction } from "./actions/reRollAction.ts";
import { setDifficultyAction } from "./actions/setDifficultyAction.ts";
import { config } from "./config.ts";
import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { reRollButton } from "./buttons/reRollButton.ts";
import { googleSheets } from "./googleSheets.ts";
import { logger } from "./logger.ts";
import { discord } from "./discord.ts";
import { dicePools } from "./dicePools.ts";
import PromiseQueue from "./utils/promiseQueue.ts";
import { dicePoolButton } from "./buttons/dicePoolButton.ts";
import { rollAction } from "./actions/rollAction.ts";
import { bot } from "./bot.ts";
import { characterManager } from "./characterManager.ts";
import { MessageScope } from "./messageScope.ts";
import { Command } from "./command.ts";

const client = new Client();

export function buildChannelCommands(channelId: string, commands: Command[]): Promise<TextChannel> {
  const channel: TextChannel = client.channels.get(channelId);

  return discord.getAllMessages(channelId).then(data => {
      switch (data.length) {
          case 0:
              return Promise.resolve();
          case 1:
              return client.rest.deleteMessage(channelId, data[0].id).then(() => Promise.resolve()); 
          default:
              return discord.bulkDeleteMessages(channelId, data.map(m => m.id)).then(() => Promise.resolve());
      }
  }).then(() => {
    const promiseQueue = new PromiseQueue();
    const done = promiseQueue.done;

    for (const command of commands) {
      promiseQueue.add(() => channel.send(command.message).then(message => {
        if (command.scopes) {
          bot.addMessageScope(message.id, command.scopes);
        }
        const reactPromiseQueue = new PromiseQueue();
        const reactDone = reactPromiseQueue.done;
        command.reactions.forEach(r => reactPromiseQueue.add(() => message.react(r)));
        reactPromiseQueue.resume();
        return reactDone;
      }));
    }

    promiseQueue.resume();

    return done;
  }).then(() => Promise.resolve(channel)); 
}

client.on('ready', () => {
  logger.info(labels.welcome);
  bot.outputChannel = client.channels.get(config.outputChannelId);

  bot.dicePoolsChannel = client.channels.get(config.dicePoolsChannelId);
  bot.storytellerChannel = client.channels.get(config.storytellerChannelId);
  buildChannelCommands(config.dicePoolsChannelId, Object.keys(dicePools).map(key => {
    return {
      message: `__**${dicePools[key].name}**__`,
      reactions: [key]
    };
  })).then(c => bot.dicePoolsChannel = c);
  //buildChannelCommands(config.storytellerChannelId, []).then(c => bot.storytellerChannel = c);
});

type RegExpAction = {
  regex: RegExp,
  action: (message: Message, matchArray: RegExpMatchArray[]) => void
}

type EmojiButton = {
  emojis: { [key: string]: any },
  button: (reaction: MessageReaction, isAdd: boolean, value: any) => void,
  scopes?: MessageScope[]
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

function emojiButtonEvent(isAdd: boolean, reaction: MessageReaction) {
  if (!reaction.me) {
    let name = <string> reaction.emoji.name;
    for(let emojiButton of emojiButtons) {
      let value = emojiButton.emojis[name];      
      if (value && (emojiButton.scopes == undefined 
      || bot.checkMessageScope(reaction, isAdd, emojiButton.scopes))) {
        logger.info(name);
        emojiButton.button(reaction, isAdd, value);  
        break;
      }
    }
  }
}

client.on('messageReactionAdd', (reaction: MessageReaction) => { 
  emojiButtonEvent(true, reaction);
});

client.on('messageReactionRemove', (reaction: MessageReaction) => { 
  emojiButtonEvent(false, reaction);
});

googleSheets.auth().then(() => characterManager.load()).then(() => {
  discord.setToken(config.discordToken);
  client.login(config.discordToken);
});