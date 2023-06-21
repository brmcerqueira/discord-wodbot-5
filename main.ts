import { ApplicationCommandPayload, Client, GatewayIntents, Interaction, InteractionMessageComponentData, InteractionResponseType, InteractionType, InteractionApplicationCommandData, MessageComponentData, MessageComponentType, TextChannel } from "./deps.ts";
import { labels } from "./i18n/labels.ts";
import { config } from "./config.ts";
import { reRollButton } from "./buttons/reRollButton.ts";
import { logger } from "./logger.ts";
import * as dicePools from "./dicePools.ts";
import * as characterServe from "./characterServe.ts";
import * as botData from "./botData.ts";
import * as characterManager from "./characterManager.ts";
import * as storyteller from "./storyteller.ts";
import { Command, ReRoll } from "./command.ts";
import { sendRoll } from "./utils/sendRoll.ts";

characterServe.start();
await characterManager.load();
characterManager.watch();

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

  switch (allMessages.size) {
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

  for (const command of channelCommands) {
    let buttons: MessageComponentData[] = [];

    const actionRows: MessageComponentData[] = [];

    for (let index = 0; index < command.buttons!.length; index++) {
      const button = command.buttons![index];

      buttons.push({
        type: MessageComponentType.Button,
        label: button.label || '',
        emoji: button.emoji,
        style: button.style,
        customID: botData.buildId(index, ...(command.scopes || []))
      });

      if (buttons.length >= 5 || index == (command.buttons!.length - 1)) {
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

client.on('ready', async () => {
  logger.info(labels.loading);
  if (!(<ApplicationCommandPayload[]><unknown>await
    client.rest.endpoints.getGlobalApplicationCommands(client.applicationID!)).find(c => c.name == labels.commands.roll.name)) {
    await client.rest.endpoints.createGlobalApplicationCommand(client.applicationID!, {
      type: 1,
      name: labels.commands.roll.name,
      description: labels.commands.roll.description,
      options: [{
        name: labels.commands.roll.dices.name,
        description: labels.commands.roll.dices.description,
        type: 4,
        required: true,
        min_value: 1,
        max_value: 99
      }, {
        name: labels.commands.roll.hunger.name,
        description: labels.commands.roll.hunger.description,
        type: 4,
        required: false,
        min_value: 1,
        max_value: 5
      }, {
        name: labels.commands.roll.difficulty.name,
        description: labels.commands.roll.difficulty.description,
        type: 4,
        required: false,
        min_value: 2,
        max_value: 9
      }, {
        name: labels.commands.roll.descriptionField.name,
        description: labels.commands.roll.descriptionField.description,
        type: 3,
        required: false
      }]
    });
  }

  await client.users.fetch(config.storytellerId);
  for (const id of Object.keys(characterManager.users)) {
    await client.users.fetch(id);
  }
  botData.setOutputChannel((await client.channels.fetch(config.outputChannelId))!);
  await buildChannelCommands(config.dicePoolsChannelId, dicePools.buildCommands());
  await buildChannelCommands(config.storytellerChannelId, storytellerCommands, async c => await botData.buildCurrentCharacterMessage(c));
  logger.info(labels.welcome);
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.user.bot && interaction.type == InteractionType.MESSAGE_COMPONENT) {
    const data = <InteractionMessageComponentData>interaction.data;
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
  else if (!interaction.user.bot && interaction.type == InteractionType.APPLICATION_COMMAND) {
    const data = <InteractionApplicationCommandData>interaction.data;
    if (data.name == labels.commands.roll.name) {
      let dices = 0;
      let hunger = 0;
      let difficulty = 1;
      let description: string | undefined = undefined;

      for (const option of data.options) {
        switch (option.name) {
          case labels.commands.roll.dices.name:
            dices = parseInt(option.value);
            break;
          case labels.commands.roll.hunger.name:
            hunger = parseInt(option.value);
            break;
          case labels.commands.roll.difficulty.name:
            difficulty = parseInt(option.value);
            break;
          case labels.commands.roll.descriptionField.name:
            description = option.value;
            break;
        }
      }

      await sendRoll(async m => {
        await interaction.respond({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          embeds: m.embeds,
          components: m.components
        });
      }, interaction.user.id, dices, hunger, difficulty, description);
    }
  }
});

client.connect();