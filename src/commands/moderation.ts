import { Actions } from "@/types";
import {
  CommandInteraction,
  InteractionType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { ban, kick, unban } from "./moderations";

export const data = new SlashCommandBuilder()
  .setName("moderation")
  .setDescription("Moderation related commands")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("ban")
      .setDescription("Ban a member")
      .addMentionableOption((option) =>
        option.setName("user").setDescription("User to ban").setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for ban")
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("kick")
      .setDescription("Kick a member")
      .addMentionableOption((option) =>
        option.setName("user").setDescription("User to kick").setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for kick")
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("unban")
      .setDescription("Unban a member")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("ID of user to unban")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for unban")
          .setRequired(false),
      ),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .setDMPermission(false);

export const execute = async (interaction: CommandInteraction) => {
  if (
    interaction.type !== InteractionType.ApplicationCommand ||
    !interaction.isChatInputCommand()
  )
    return;

  const command = interaction.options.getSubcommand();

  await interaction.deferReply();

  const actions: Actions = {
    ban: ban,
    kick: kick,
    unban: unban,
  };

  return actions[command](interaction);
};
