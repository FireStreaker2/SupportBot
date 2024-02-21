import {
  CommandInteraction,
  InteractionType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { list, panel, setup } from "./ticket";
import { Actions } from "@/types";

export const data = new SlashCommandBuilder()
  .setName("tickets")
  .setDescription("Ticket related commands")
  .addSubcommand((subcommand) =>
    subcommand.setName("list").setDescription("See all current tickets"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("panel")
      .setDescription("Create a new ticket panel")
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
      .setDescription("Setup tickets for your server")
      .addChannelOption((option) =>
        option
          .setName("category")
          .setDescription("Category to put tickets in")
          .setRequired(true),
      )
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription("Support role for tickets")
          .setRequired(true),
      ),
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
  await interaction.deferReply({ ephemeral: command === "panel" });

  const actions: Actions = {
    list: list,
    panel: panel,
    setup: setup,
  };

  return actions[command](interaction);
};
