import { Actions } from "@/types";
import {
  CommandInteraction,
  InteractionType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { manual, panel, setup } from "./verifications";

export const data = new SlashCommandBuilder()
  .setName("verification")
  .setDescription("Verification related commands")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("manual")
      .setDescription("Manually verify a member")
      .addMentionableOption((option) =>
        option
          .setName("user")
          .setDescription("User to verify")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("panel")
      .setDescription("Create a verification panel")
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
      .setDescription("Setup verification for your server")
      .addMentionableOption((option) =>
        option
          .setName("role")
          .setDescription("Role given when verified")
          .setRequired(true),
      )
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Channel for logging")
          .setRequired(true),
      ),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
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
    manual: manual,
    panel: panel,
    setup: setup,
  };

  return actions[command](interaction);
};
