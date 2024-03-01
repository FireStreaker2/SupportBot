import {
  CommandInteraction,
  EmbedBuilder,
  Guild,
  TextChannel,
} from "discord.js";
import { ticketConfig } from "@/config";

const logClosedTicket = async (
  interaction: CommandInteraction,
  guild: Guild,
  ticket: TextChannel,
) => {
  const channel = guild.channels.cache.get(
    ticketConfig[guild?.id as string].channel,
  );

  const embed = new EmbedBuilder()
    .setTitle("Ticket Closed")
    .setDescription("A previously opened ticket has now been closed.")
    .addFields(
      {
        name: "User",
        value: `<@${interaction.user.id}> (${interaction.user.displayName})`,
      },
      { name: "Ticket Opened", value: ticket.createdAt.toString() },
      {
        name: "Ticked Closed",
        value: new Date().toString(),
      },
    );

  return (channel as TextChannel)?.send({ embeds: [embed] });
};

export { logClosedTicket };
