import { CommandInteraction, EmbedBuilder } from "discord.js";

const unban = async (interaction: CommandInteraction) => {
  const embed = new EmbedBuilder();

  try {
    const user = interaction.options.get("user")?.value as string;
    await interaction.guild?.members.unban(
      user,
      (interaction.options.get("reason")?.value as string) ||
        "No reason provided",
    );

    embed
      .setColor(0x00ff00)
      .setTitle("Sucess")
      .setDescription(`Succesfully unbanned <@${user}>`);
  } catch (error) {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        `An error occurred whilst trying to unban this user: ${error}`,
      );
  }

  return interaction.editReply({ embeds: [embed] });
};

export default unban;
