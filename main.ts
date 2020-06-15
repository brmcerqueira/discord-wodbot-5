import { Logger } from "log4deno/index.ts";
import { Client, Message } from "katana/mod.ts";
import { dicePoolAction } from "./dicePoolAction.ts";

const logger = new Logger({
  default: {
    types: ['console'],
    logLevel: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'],
    logFormat: '[$date] [$level] [$name]',
    dateFormat: 'yyyy-MM-dd HH:mm:ss',
  }
});

const client = new Client();

client.on('ready', () => {
  logger.info('Wodbot 5.0 entrou!');
});

type RegExpAction = {
  regex: RegExp,
  action: (logger: Logger, message: Message, matchArray: RegExpMatchArray[]) => void
}

const regExpActions: RegExpAction[] = [
  {
    regex: /^%(?<dices>[1-9]?\d)\s*(\!(?<hunger>[1-5]))?\s*(\*(?<difficulty>[2-9]))?\s*(?<description>.*)/g,
    action: dicePoolAction
  }
]

client.on('message', (message: Message) => {
  for(let regExpAction of regExpActions) {
    let resultMatchAll = [...message.content.matchAll(regExpAction.regex)];
    if (resultMatchAll.length > 0) {
      regExpAction.action(logger, message, resultMatchAll);
      break;
    }
  }
});

client.login(Deno.args[0]);