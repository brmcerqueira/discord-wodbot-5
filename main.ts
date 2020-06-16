import { Logger } from "log4deno/index.ts";
import { Config } from "config/mod.ts";
import { Client, Message } from "katana/mod.ts";
import { labels } from "./i18n/labels.ts";
import { dicePoolAction } from "./actions/dicePoolAction.ts";
import { reRollAction } from "./actions/reRollAction.ts";
import { setDifficultyAction } from "./actions/setDifficultyAction.ts";
import { ConfigDef } from "./configDef.ts";

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
    action: (logger: Logger, config: any, message: Message, matchArray: RegExpMatchArray[]) => void
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
  
  client.login(config.discordToken);
}
else {
  logger.info(labels.configNotFound);
}