import { Client, GatewayIntents, Interaction, InteractionMessageComponentData, InteractionResponseType, InteractionType, Message, MessageComponentData, MessageComponentType, TextChannel } from "./deps.ts";
import { labels } from "./i18n/labels.ts";
import { config } from "./config.ts";
import { reRollButton } from "./buttons/reRollButton.ts";
import * as googleDrive from "./googleDrive.ts";
import { logger } from "./logger.ts";
import * as dicePools from "./dicePools.ts";
import { rollAction } from "./actions/rollAction.ts";
import * as botData from "./botData.ts";
import * as characterManager from "./characterManager.ts";
import * as storyteller from "./storyteller.ts";
import { Command, ReRoll } from "./command.ts";

await googleDrive.auth();
await characterManager.load();

const storytellerCommands = storyteller.buildCommands();

const commands: Command[] = [{
  scopes: [ReRoll],
  action: reRollButton
}];

const client = new Client({
  token: config.discordToken,
  intents: [
    GatewayIntents.GUILDS,
    GatewayIntents.GUILD_MESSAGES,
    GatewayIntents.GUILD_MESSAGE_REACTIONS,
    GatewayIntents.GUILD_MESSAGE_REACTIONS,
    GatewayIntents.DIRECT_MESSAGES,
    GatewayIntents.DIRECT_MESSAGE_REACTIONS,
    GatewayIntents.MESSAGE_CONTENT,
  ]
});

async function buildChannelCommands(channelId: string, channelCommands: Command[], beforeMessages?: (c: TextChannel) => Promise<void>) {
  const channel: TextChannel = await client.channels.fetch(channelId);

  const allMessages = await channel.fetchMessages();

  switch(allMessages.size) {
    case 0:
      break;
    case 1:
      await client.rest.endpoints.deleteMessage(channel.id, allMessages.first()!.id);
      break;
    default:
      await client.rest.endpoints.bulkDeleteMessages(channel.id, <any>{ messages: allMessages.map(m => m.id) });
      break;
  }

  if (beforeMessages) {
    await beforeMessages(channel);
  }

  for(const command of channelCommands) {
    let buttons: MessageComponentData[] = [];

    const actionRows: MessageComponentData[] = [];

    for(let index = 0;index < command.buttons!.length;index++) {
      const button = command.buttons![index];

      buttons.push({
        type: MessageComponentType.Button,
        label: button.label || '',
        emoji: button.emoji,
        style: button.style,
        customID: botData.buildId(index, ...(command.scopes || []))
      });

      if(buttons.length >= 5 || index == (command.buttons!.length - 1)) {
        actionRows.push({
          type: MessageComponentType.ActionRow,
          components: buttons
        });
        buttons = [];
      }
    }

    await channel.send(command.message, {
      components: actionRows
    });

    commands.push(command);
  }
}

type RegExpAction = {
  regex: RegExp,
  action: (message: Message, matchArray: RegExpMatchArray[]) => Promise<void>
}

const regExpActions: RegExpAction[] = [{
  regex: /^%(?<dices>[1-9]?\d)\s*(\!(?<hunger>[1-5]))?\s*(\*(?<difficulty>[2-9]))?\s*(?<description>.*)/g,
  action: rollAction
}];

client.on('ready', async () => {
  logger.info(labels.loading);
  await client.users.fetch(config.storytellerId);
  for (const id of Object.keys(config.playerCharacters)) {
    await client.users.fetch(id);
  }
  botData.setOutputChannel((await client.channels.fetch(config.outputChannelId))!);
  await buildChannelCommands(config.dicePoolsChannelId, dicePools.buildCommands());
  await buildChannelCommands(config.storytellerChannelId, storytellerCommands, async c => await botData.buildCurrentCharacterMessage(c));
  logger.info(labels.welcome);
});

client.on('messageCreate', async (message: Message) => {
  if (!message.author.bot) {
    logger.debug(labels.log.messageCreateEvent, message.content);
    for (const regExpAction of regExpActions) {
      const resultMatchAll = [...message.content.matchAll(regExpAction.regex)];
      if (resultMatchAll.length > 0) {
        await regExpAction.action(message, resultMatchAll);
        break;
      }
    }
  }
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.user.bot && interaction.type == InteractionType.MESSAGE_COMPONENT) {
    const data = <InteractionMessageComponentData> interaction.data;
    const customId = botData.parseCustomId(data.custom_id);
    logger.debug(labels.log.interactionCreateEvent, interaction.message?.content, customId.index);
    for (const command of commands) {
      if (command.scopes == undefined || botData.checkMessageScope(interaction.user, customId, command.scopes)) {
        await command.action(interaction, 
          command.buttons ? command.buttons[customId.index].value : customId, 
          command.scopes);
        if (!interaction.responded) {
          await interaction.respond({
            type: InteractionResponseType.UPDATE_MESSAGE,
            content: interaction.message!.content
          });
        }  
        break;
      }
    }
  }
});

client.connect();