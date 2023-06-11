import { User, Member, Emoji } from "./deps.ts";

export type MessageReaction = {
  userId: bigint;
  channelId: bigint;
  messageId: bigint;
  guildId?: bigint;
  member?: Member;
  user?: User;
  emoji: Emoji;
};
