import { CommandInteraction, EmbedBuilder } from "discord.js";
import { ticketConfig } from "@/config";

const setup = async (interaction: CommandInteraction) => {
  ticketConfig[interaction.guild?.id as string] = {
    category: interaction.options.get("category")?.value as string,
    role: interaction.options.get("role")?.value as string,
  };

  const embed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle("Server Setup")
    .setDescription(`Succesfully setup tickets for ${interaction.guild?.name}!`)
    .addFields(
      {
        name: "Support Category",
        value: `<#${ticketConfig[interaction.guild?.id as string].category}>`,
      },
      {
        name: "Support Role",
        value: `<@&${ticketConfig[interaction.guild?.id as string].role}>`,
      },
      {
        name: "Note",
        value: "Make sure all the permissions are already pre-configured!",
      },
    );

  return interaction.editReply({ embeds: [embed] });
};

export default setup;
