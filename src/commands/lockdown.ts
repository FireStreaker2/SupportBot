import { Actions } from "@/types";
import {
  CommandInteraction,
  InteractionType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { channel, server } from "./lockdowns";

export const data = new SlashCommandBuilder()
  .setName("lockdown")
  .setDescription("Lockdown related commands")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("channel")
      .setDescription("Lock a channel")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Channel to lock. Defaults to the current channel")
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("server").setDescription("Lock the entire server"),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

export const execute = async (interaction: CommandInteraction) => {
  if (
    interaction.type !== InteractionType.ApplicationCommand ||
    !interaction.isChatInputCommand()
  )
    return;

  const command = interaction.options.getSubcommand();

  await interaction.deferReply({ ephemeral: true });

  const actions: Actions = {
    channel: channel,
    server: server,
  };

  return actions[command](interaction);
};
