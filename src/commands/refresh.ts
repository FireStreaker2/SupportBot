import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { deploy } from "@/deploy";

export const data = new SlashCommandBuilder()
  .setName("refresh")
  .setDescription("Refresh commands in your server");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();

  if (interaction.guild?.id) {
    await deploy(interaction.guild.id);

    return interaction.editReply("Commands have succesfully been refreshed!");
  } else {
    return interaction.editReply("An error occurred while refreshing");
  }
};
