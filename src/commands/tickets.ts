import {
  CommandInteraction,
  InteractionType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { add, close, list, panel, remove, setup } from "./ticket";
import { Actions } from "@/types";

export const data = new SlashCommandBuilder()
  .setName("tickets")
  .setDescription("Ticket related commands")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("close")
      .setDescription(
        "Close the channel this command is ran in if it is a valid ticket",
      ),
  )
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
  .addSubcommandGroup((subcommandGroup) =>
    subcommandGroup
      .setName("user")
      .setDescription("Specific user utilities for tickets")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("add")
          .setDescription("Add a user to the current ticket")
          .addMentionableOption((option) =>
            option
              .setName("user")
              .setDescription("User to add to the current ticket")
              .setRequired(true),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("remove")
          .setDescription("Remove a user from the current ticket")
          .addMentionableOption((option) =>
            option
              .setName("user")
              .setDescription("User to remove from the curren ticket")
              .setRequired(true),
          ),
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
    add: add,
    close: close,
    list: list,
    panel: panel,
    remove: remove,
    setup: setup,
  };

  return actions[command](interaction);
};
