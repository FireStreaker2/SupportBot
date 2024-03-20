import { CommandInteraction, EmbedBuilder } from "discord.js";

const server = async (interaction: CommandInteraction) => {
  const guild = interaction.guild;

  const embed = new EmbedBuilder()
    .setTitle(guild?.name as string)
    .setDescription(guild?.description || "No description")
    .addFields(
      { name: "ID", value: guild?.id as string },
      { name: "Owner", value: `<@${guild?.ownerId}>` },
      { name: "Created At", value: guild?.createdAt.toDateString() as string },
      {
        name: "Roles",
        value: guild?.roles.cache.map((role) => role).join(", ") as string,
      },
    );

  return interaction.editReply({ embeds: [embed] });
};

export default server;
