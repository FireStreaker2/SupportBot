import { Actions } from "@/types";
import {
  CommandInteraction,
  InteractionType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { all, member, panel } from "./roles";

export const data = new SlashCommandBuilder()
  .setName("role")
  .setDescription("Role related commands")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("all")
      .setDescription("Give a role to every member")
      .addMentionableOption((option) =>
        option
          .setName("role")
          .setDescription("Role to give to every member")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("member")
      .setDescription("Give a role to a member")
      .addMentionableOption((option) =>
        option
          .setName("user")
          .setDescription("Member to give the role to")
          .setRequired(true),
      )
      .addMentionableOption((option) =>
        option
          .setName("role")
          .setDescription("Role to give to the member")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("panel").setDescription("Create a reaction role panel"),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setDMPermission(false);

export const execute = async (interaction: CommandInteraction) => {
  if (
    interaction.type !== InteractionType.ApplicationCommand ||
    !interaction.isChatInputCommand()
  )
    return;

  const command = interaction.options.getSubcommand();

  await interaction.deferReply({ ephemeral: command === "panel" });

  const actions: Actions = {
    all: all,
    member: member,
    panel: panel,
  };

  return actions[command](interaction);
};
