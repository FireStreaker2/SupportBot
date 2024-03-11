import { CommandInteraction, EmbedBuilder } from "discord.js";
import { reportConfig } from "@/config";

const setup = async (interaction: CommandInteraction) => {
  reportConfig[interaction.guild?.id as string] = interaction.options.get(
    "channel",
  )?.value as string;

  const embed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle("Server Setup")
    .setDescription(`Succesfully setup reports for ${interaction.guild?.name}!`)
    .addFields(
      {
        name: "Logging Channel",
        value: `<#${reportConfig[interaction.guild?.id as string]}>`,
      },
      {
        name: "Note",
        value: "Make sure all the permissions are already pre-configured!",
      },
    );

  return interaction.editReply({ embeds: [embed] });
};

export default setup;
