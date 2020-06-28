import { Logger } from "log4deno/index.ts";
import { Config } from "config/mod.ts";
import { Client, Message } from "katana/mod.ts";
import { labels } from "./i18n/labels.ts";
import { dicePoolAction } from "./actions/dicePoolAction.ts";
import { reRollAction } from "./actions/reRollAction.ts";
import { setDifficultyAction } from "./actions/setDifficultyAction.ts";
import { ConfigDef } from "./configDef.ts";
import { MessageReaction } from "katana/src/models/MessageReaction.ts";
import { reRollButton } from "./buttons/reRollButton.ts";

const logger = new Logger({
  default: {
    types: ['console'],
    logLevel: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'],
    logFormat: '[$date] [$level] [$name]',
    dateFormat: 'yyyy-MM-dd HH:mm:ss',
  }
});

const config: ConfigDef = <ConfigDef> await Config.load({
  file: 'default'
});

if (config) {
  const client = new Client();

  client.on('ready', () => {
    logger.info(labels.welcome);
  });
  
  type RegExpAction = {
    regex: RegExp,
    action: (logger: Logger, config: ConfigDef, message: Message, matchArray: RegExpMatchArray[]) => void
  }

  type EmojiButton = {
    emojis: { [key: string]: any },
    button: (logger: Logger, config: ConfigDef, reaction: MessageReaction, isAdd: boolean, value: any) => void,
    addOrRemoveScope?: boolean
  }
  
  const regExpActions: RegExpAction[] = [
    {
      regex: /^%(?<dices>[1-9]?\d)\s*(\!(?<hunger>[1-5]))?\s*(\*(?<difficulty>[2-9]))?\s*(?<description>.*)/g,
      action: dicePoolAction
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
    }
  ]

  client.on('message', (message: Message) => {
    for(let regExpAction of regExpActions) {
      let resultMatchAll = [...message.content.matchAll(regExpAction.regex)];
      if (resultMatchAll.length > 0) {
        logger.info(message.user.id, message.content, resultMatchAll);
        regExpAction.action(logger, config, message, resultMatchAll);
        break;
      }
    }
  });
  
  function emojiButtonCallback(isAdd: boolean, reaction: MessageReaction) {
    let name = <string> reaction.emoji.name;
    for(let emojiButton of emojiButtons) {
      let value = emojiButton.emojis[name];      
      if (value && (emojiButton.addOrRemoveScope == undefined 
      || (emojiButton.addOrRemoveScope && isAdd) 
      || (!emojiButton.addOrRemoveScope && !isAdd))) {
        logger.info(name);
        emojiButton.button(logger, config, reaction, isAdd, value);
        break;
      }
    }
  }

  client.on('messageReactionAdd', (reaction: MessageReaction) => { 
    emojiButtonCallback(true, reaction);
  });

  client.on('messageReactionRemove', (reaction: MessageReaction) => { 
    emojiButtonCallback(false, reaction);
  });

  client.login(config.discordToken);
}
else {
  logger.info(labels.configNotFound);
}