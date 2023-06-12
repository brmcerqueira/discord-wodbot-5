import { Client, Embed, GatewayIntents, Message, MessageReaction, TextChannel, User } from "./deps.ts";
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

await googleSheets.auth();
await characterManager.load();

const commands = buildCommands();

const client = new Client({
  token: config.discordToken,
  intents:  [
    GatewayIntents.GUILDS,
    GatewayIntents.GUILD_MESSAGES,
    GatewayIntents.DIRECT_MESSAGES
  ]
})

async function buildChannelCommands(channelId: string, commands: Command[]): Promise<void> {
  const channel = <TextChannel> await client.channels.get<TextChannel>(channelId);
  const allMessages = await client.rest.endpoints.getChannelMessages(channelId);

  switch (allMessages.length) {
    case 0:
      break;
    case 1:
      await client.rest.endpoints.deleteMessage(channelId, allMessages[0].id);
      break;
    default:
      await client.rest.endpoints.bulkDeleteMessages(channelId, allMessages.map(m => m.id));
      break;
  }

  for (const command of commands) {
    const message = await channel.send(channelId, typeof command.message == "string" ? {
      content: <string>command.message
    }: {
      embeds: [<Embed>command.message]
    });

    if (command.scopes) {
      botData.addMessageScope(message.id, command.scopes);
    }

    for (const reaction of (Array.isArray(command.reactions) ? <string[]> command.reactions : Object.keys(command.reactions))) {
      await message.addReaction(reaction);
    }
  }
}

type RegExpAction = {
  regex: RegExp,
  action: (message: Message, matchArray: RegExpMatchArray[]) => Promise<void>
}

type EmojiButton = {
  emojis: {
    [key: string]: any
  },
  button: (reaction: MessageReaction, value: any, scopes ? : MessageScope[]) => Promise<void>,
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

async function emojiButtonEvent(isAdd: boolean, reaction: MessageReaction) {
  const name = <string> reaction.emoji.name;
  for (const emojiButton of emojiButtons) {
    const value = emojiButton.emojis[name];
    if (value && (emojiButton.scopes == undefined ||
      await botData.checkMessageScope(reaction, isAdd, emojiButton.scopes))) {
      await emojiButton.button(reaction, value, emojiButton.scopes);
      break;
    }
  }
}

client.on('ready', async () => {
  logger.info(labels.welcome);
  botData.outputChannel = <TextChannel> await client.channels.get<TextChannel>(config.outputChannelId);
  await buildChannelCommands(config.dicePoolsChannelId, Object.keys(dicePools).map(key => {
    return {
      message: `__**${dicePools[key].name}**__`,
      reactions: [key]
    };
  }));
  await buildChannelCommands(config.storytellerChannelId, commands);
});

client.on('messageCreate', async (message: Message) => {
  for (const regExpAction of regExpActions) {
    const resultMatchAll = [...message.content.matchAll(regExpAction.regex)];
    if (resultMatchAll.length > 0) {
      await regExpAction.action(message, resultMatchAll);
      break;
    }
  }
});

client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
  await emojiButtonEvent(true, reaction);
});

client.on('messageReactionRemove', async (reaction: MessageReaction, user: User) => {
  await emojiButtonEvent(false, reaction);  
});

client.connect();