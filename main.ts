import { createBot, Intents, startBot, Message, Bot, DiscordEmbed, transformEmbed } from "./deps.ts";
import { labels } from "./i18n/labels.ts";
import { config } from "./config.ts";
import { reRollButton } from "./buttons/reRollButton.ts";
import { googleSheets } from "./googleSheets.ts";
import { logger } from "./logger.ts";
import { dicePools } from "./dicePools.ts";
import { dicePoolButton } from "./buttons/dicePoolButton.ts";
import { rollAction } from "./actions/rollAction.ts";
import { botData } from "./botData.ts";
import { characterManager } from "./characterManager.ts";
import { MessageScope } from "./messageScope.ts";
import { Command, buildCommands } from "./command.ts";
import { MessageReaction } from "./messageReaction.ts";

await googleSheets.auth();
await characterManager.load();

const commands = buildCommands();

async function buildChannelCommands(bot: Bot, channelId: bigint, commands: Command[]): Promise<void> {
  const allMessages = await bot.helpers.getMessages(channelId);

  if (allMessages.size > 0) {
    await bot.helpers.deleteMessages(channelId, allMessages.map(m => m.id));
  }

  for (const command of commands) {
    const message = await bot.helpers.sendMessage(channelId, typeof command.message == "string" ? {
      content: <string>command.message
    }: {
      embeds: [transformEmbed(bot, <DiscordEmbed>command.message)]
    });

    if (command.scopes) {
      botData.addMessageScope(message.id, command.scopes);
    }

    await bot.helpers.addReactions(channelId, message.id, (Array.isArray(command.reactions) ?
      command.reactions : Object.keys(command.reactions)));
  }
}

type RegExpAction = {
  regex: RegExp,
  action: (bot: Bot, message: Message, matchArray: RegExpMatchArray[]) => void
}

type EmojiButton = {
  emojis: {
    [key: string]: any
  },
  button: (bot:Bot, reaction: MessageReaction, value: any, scopes ? : MessageScope[]) => void,
  scopes ? : MessageScope[]
}

const regExpActions: RegExpAction[] = [{
  regex: /^%(?<dices>[1-9]?\d)\s*(\!(?<hunger>[1-5]))?\s*(\*(?<difficulty>[2-9]))?\s*(?<description>.*)/g,
  action: rollAction
}];

function buildEmojiButtons(defaultButtons: EmojiButton[]): EmojiButton[] {
  const result = [];

  for (const command of commands) {
    let emojis: {
      [key: string]: any
    };

    if (Array.isArray(command.reactions)) {
      emojis = {};
      command.reactions.forEach(r => emojis[r] = r);
    } 
    else {
      emojis = command.reactions;
    }

    result.push({
      emojis: emojis,
      button: command.button,
      scopes: command.scopes
    });
  }

  for (const button of defaultButtons) {
    result.push(button);
  }

  return result;
}

const emojiButtons: EmojiButton[] = buildEmojiButtons([{
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
]);

function emojiButtonEvent(isAdd: boolean, bot: Bot, reaction: MessageReaction) {
  const name = <string> reaction.emoji.name;
  for (const emojiButton of emojiButtons) {
    const value = emojiButton.emojis[name];
    if (value && (emojiButton.scopes == undefined ||
      botData.checkMessageScope(reaction, isAdd, emojiButton.scopes))) {
      emojiButton.button(bot, reaction, value, emojiButton.scopes);
      break;
    }
  }
}

await startBot(createBot({
  token: config.discordToken,
  intents: Intents.Guilds | Intents.GuildMessages,
  events: {
    ready(bot: Bot) { 
      logger.info(labels.welcome);
      buildChannelCommands(bot, config.dicePoolsChannelId, Object.keys(dicePools).map(key => {
        return {
          message: `__**${dicePools[key].name}**__`,
          reactions: [key]
        };
      })).then(() => {
        buildChannelCommands(bot, config.storytellerChannelId, commands);
      });
    },
    messageCreate(bot: Bot, message: Message) {
      for (const regExpAction of regExpActions) {
        const resultMatchAll = [...message.content.matchAll(regExpAction.regex)];
        if (resultMatchAll.length > 0) {
          regExpAction.action(bot, message, resultMatchAll);
          break;
        }
      }
    },
    reactionAdd(bot: Bot, reaction: MessageReaction) {
      emojiButtonEvent(true, bot, reaction);
    },
    reactionRemove(bot: Bot, reaction: MessageReaction) {
      emojiButtonEvent(false, bot, reaction);  
    }
  },
}));