import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { deploy } from "@/deploy";

export const data = new SlashCommandBuilder()
  .setName("refresh")
  .setDescription("Refresh commands in your server")
  .setDMPermission(false);

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();

  const embed = new EmbedBuilder();

  if (interaction.guild?.id) {
    await deploy(interaction.guild.id);

    embed
      .setColor(0x00ff00)
      .setTitle("Success")
      .setDescription("Commands have succesfully been refreshed!");
  } else {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription("An error occurred while refreshing");
  }

  return interaction.editReply({ embeds: [embed] });
};
