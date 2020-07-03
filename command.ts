import { MessageEmbed } from "katana/mod.ts";
import { MessageScope } from "./messageScope.ts";

export type Command = {
    message: string | MessageEmbed,
    reactions: string[],
    scopes?: MessageScope[]
}