import { ButtonStyle, Embed, Interaction, MessageComponentEmoji } from "./deps.ts";
import { Scope } from "./scope.ts";

export type Button = {
  style: ButtonStyle;
  value?: any;
  label?: string;
  disabled?: boolean;
  emoji?: MessageComponentEmoji;
};

export type ActionCallBack = (interaction: Interaction, value: any, scopes?: Scope[]) => Promise<void>;

export interface Action {
  action: ActionCallBack;
  message?: string | Embed;
  buttons?: Button[];
  scopes?: Scope[];
}