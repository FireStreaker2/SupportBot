import {
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  Guild,
} from "discord.js";
import { ticketConfig } from "@/config";

const list = async (interaction: CommandInteraction) => {
  const guild = interaction.guild as Guild;

  if (!ticketConfig[guild.id]) {
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        "This server has not been properly setup yet! Please run the ``/tickets setup`` command to continue!",
      );

    return interaction.editReply({ embeds: [embed] });
  }

  const category = guild.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      channel.id === ticketConfig[guild?.id as string].category,
  );

  const channelsInCategory = guild.channels.cache.filter(
    (channel) =>
      channel.type === ChannelType.GuildText &&
      channel.parentId === category?.id,
  );

  const tickets =
    channelsInCategory.size === 0
      ? "none"
      : channelsInCategory.map((channel) => channel.name).join("\n");

  const embed = new EmbedBuilder()
    .setColor(0x000)
    .setTitle("Ticket List")
    .setDescription(tickets);

  return interaction.editReply({ embeds: [embed] });
};

export default list;
