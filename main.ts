import { ApplicationCommandPayload, Client, GatewayIntents, Interaction, InteractionMessageComponentData, InteractionResponseType, InteractionType, InteractionApplicationCommandData, MessageComponentData, MessageComponentType, TextChannel, Embed } from "./deps.ts";
import { labels } from "./i18n/labels.ts";
import { config } from "./config.ts";
import { logger } from "./logger.ts";
import * as dicePools from "./dicePools.ts";
import * as characterServe from "./characterServe.ts";
import * as botData from "./botData.ts";
import * as characterManager from "./characterManager.ts";
import * as storyteller from "./storyteller.ts";
import { sendRoll } from "./utils/sendRoll.ts";
import { Action } from "./action.ts";
import { ReRoll, buildId, checkScope, parseCustomId } from "./scope.ts";
import { reRollSolver } from "./solver/reRollSolver.ts";

characterServe.start();
await characterManager.load();
characterManager.watch();

const storytellerActions = storyteller.buildActions();

const actions: Action[] = [{
  scopes: [ReRoll],
  solve: reRollSolver
}];

type Attachment = {
  url: string,
  size: number,
  proxy_url: string,
  id: string,
  filename: string,
  ephemeral: boolean,
  content_type: string
}

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

async function buildChannelActions(channelId: string, channelActions: Action[], beforeMessages?: (c: TextChannel) => Promise<void>) {
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

  for (const action of channelActions) {
    let buttons: MessageComponentData[] = [];

    const actionRows: MessageComponentData[] = [];

    for (let index = 0; index < action.buttons!.length; index++) {
      const button = action.buttons![index];

      buttons.push({
        type: MessageComponentType.Button,
        label: button.label || '',
        emoji: button.emoji,
        style: button.style,
        customID: buildId(index, ...(action.scopes || []))
      });

      if (buttons.length >= 5 || index == (action.buttons!.length - 1)) {
        actionRows.push({
          type: MessageComponentType.ActionRow,
          components: buttons
        });
        buttons = [];
      }
    }

    await channel.send(action.message, {
      components: actionRows
    });

    actions.push(action);
  }
}

client.on('ready', async () => {
  logger.info(labels.loading);

  const commands = <ApplicationCommandPayload[]><unknown> await client.rest.endpoints.getGlobalApplicationCommands(client.applicationID!);

  if (!commands.find(c => c.name == labels.commands.roll.name)) {
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

  if (!commands.find(c => c.name == labels.commands.uploadCharacter.name)) {
    await client.rest.endpoints.createGlobalApplicationCommand(client.applicationID!, {
      type: 1,
      name: labels.commands.uploadCharacter.name,
      description: labels.commands.uploadCharacter.description,
      dm_permission: true,
      options: [{
        name: labels.commands.uploadCharacter.file.name,
        description: labels.commands.uploadCharacter.file.description,
        type: 11,
        required: true
      }]
    });
  }

  await client.users.fetch(config.storytellerId);
  for (const id of Object.keys(characterManager.users)) {
    await client.users.fetch(id);
  }
  botData.setOutputChannel((await client.channels.fetch(config.outputChannelId))!);
  await buildChannelActions(config.dicePoolsChannelId, dicePools.buildActions());
  await buildChannelActions(config.storytellerChannelId, storytellerActions, async c => await botData.buildCurrentCharacterMessage(c));
  logger.info(labels.welcome);
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.user.bot && interaction.type == InteractionType.MESSAGE_COMPONENT) {
    const data = <InteractionMessageComponentData>interaction.data;
    const customId = parseCustomId(data.custom_id);
    for (const action of actions) {
      if (action.scopes == undefined || checkScope(interaction.user, customId, action.scopes)) {
        await action.solve(interaction,
          action.buttons ? action.buttons[customId.index].value : customId,
          action.scopes);
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
    else if(data.name == labels.commands.uploadCharacter.name) {
      const attachment: Attachment = (<any>data.resolved)["attachments"][data.options[0].value];
      if (attachment.content_type == "application/pdf") {
        await characterManager.saveCharacter(attachment.url, interaction.user);
        await interaction.respond({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          embeds: [new Embed({
            title: labels.uploadCharacterSuccess,
            //Verde
            color: 3066993
          })]
        });
      }
    }
  }
});

client.connect();