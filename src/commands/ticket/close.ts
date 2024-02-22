import { CommandInteraction, EmbedBuilder, TextChannel } from "discord.js";

const close = async (interaction: CommandInteraction) => {
  if (!(interaction.channel as TextChannel)?.name.includes("ticket-")) {
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription("This channel is not a ticket!");

    return interaction.editReply({ embeds: [embed] });
  }

  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Deleting Ticket")
    .setDescription("Deleting ticket in 10 seconds...");

  await interaction.editReply({ embeds: [embed] });

  await new Promise((resolve) => setTimeout(resolve, 10000));

  return interaction.channel?.delete();
};

export default close;
