import { MessageScope } from "./messageScope.ts";
import { ButtonStyle, Embed, Interaction, MessageComponentEmoji } from "./deps.ts";

export type Button = {
  style: ButtonStyle;
  value?: any;
  label?: string;
  disabled?: boolean;
  emoji?: MessageComponentEmoji;
};

export type CommandAction = (interaction: Interaction, value: any, scopes?: MessageScope[]) => Promise<void>;

export interface Command {
  action: CommandAction;
  message?: string | Embed;
  buttons?: Button[];
  scopes?: MessageScope[];
}