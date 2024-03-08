import { Actions } from "@/types";
import {
  CommandInteraction,
  InteractionType,
  SlashCommandBuilder,
} from "discord.js";
import { member, role, server } from "./infos";

export const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Info related commands")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("member")
      .setDescription("See info regarding a specific member")
      .addMentionableOption((option) =>
        option
          .setName("member")
          .setDescription("Member to look up")
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("role")
      .setDescription("See info regarding a specific role")
      .addMentionableOption((option) =>
        option
          .setName("role")
          .setDescription("Role to look up")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("server")
      .setDescription("See info regarding the server"),
  )
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
    member: member,
    role: role,
    server: server,
  };

  return actions[command](interaction);
};
