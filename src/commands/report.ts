import { Actions } from "@/types";
import {
  CommandInteraction,
  InteractionType,
  SlashCommandBuilder,
} from "discord.js";
import { manual, panel, setup } from "./reports";

export const data = new SlashCommandBuilder()
  .setName("report")
  .setDescription("Report related commands")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("manual")
      .setDescription("Manually report a user")
      .addMentionableOption((option) =>
        option
          .setName("user")
          .setDescription("User to report")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for reporting")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("panel")
      .setDescription("Create a report panel")
      .addStringOption((option) =>
        option
          .setName("title")
          .setDescription("Title of panel embed")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("description")
          .setDescription("Description of panel embed")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("btitle")
          .setDescription("Title of button")
          .setRequired(true),
      )
      .addAttachmentOption((option) =>
        option
          .setName("thumbnail")
          .setDescription("Thumbnail image for the panel embed")
          .setRequired(false),
      )
      .addAttachmentOption((option) =>
        option
          .setName("image")
          .setDescription("Image for panel embed")
          .setRequired(false),
      )
      .addStringOption((option) =>
        option
          .setName("color")
          .setDescription("Color of the panel embed in hex. Defaults to black.")
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("setup")
      .setDescription("Setup reporting in your server")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Channel for logging")
          .setRequired(true),
      ),
  )
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
    manual: manual,
    panel: panel,
    setup: setup,
  };

  return actions[command](interaction);
};
