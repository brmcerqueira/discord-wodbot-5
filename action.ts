import { ButtonStyle, Embed, Interaction, MessageComponentEmoji } from "./deps.ts";
import { Scope } from "./scope.ts";

export type Button = {
  style: ButtonStyle;
  value?: any;
  label?: string;
  disabled?: boolean;
  emoji?: MessageComponentEmoji;
};

export interface Action {
  solve: (interaction: Interaction, value: any, scopes?: Scope[]) => Promise<void>;
  message?: string | Embed;
  buttons?: Button[];
  scopes?: Scope[];
}