import { ButtonStyle, Embed, Interaction, MessageComponentEmoji } from "./deps.ts";

export type Button = {
  style: ButtonStyle;
  value?: any;
  label?: string;
  disabled?: boolean;
  emoji?: MessageComponentEmoji;
};

export type CommandScope = {
  value: number
}

export type CommandAction = (interaction: Interaction, value: any, scopes?: CommandScope[]) => Promise<void>;

export interface Command {
  action: CommandAction;
  message?: string | Embed;
  buttons?: Button[];
  scopes?: CommandScope[];
}

let scopeSeed = 0;
export const allScopes: CommandScope[] = [];

export function createCommandScope(): CommandScope {
    const result = {
      value: 1 << scopeSeed
    };

    allScopes.push(result);

    scopeSeed++;

    return result;
}

export const Storyteller = createCommandScope();
export const SetDifficulty = createCommandScope();
export const ReloadCharacters = createCommandScope();
export const ChangeCharacter = createCommandScope();
export const AddExperience = createCommandScope();
export const DecreaseExperience = createCommandScope();
export const SetHunger = createCommandScope();
export const ReRoll = createCommandScope();
export const DicePool = createCommandScope();