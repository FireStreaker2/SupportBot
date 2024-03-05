import { CommandInteraction, EmbedBuilder, TextChannel } from "discord.js";
import { lockChannel, unlockChannel } from "./util";

const channel = async (interaction: CommandInteraction) => {
  let message = "";

  const channel = (interaction.options.get("channel")?.channel ||
    interaction.channel) as TextChannel;

  try {
    if (channel.topic?.includes("This channel is currently locked.")) {
      await unlockChannel(interaction, channel);
      message = `Succesfully unlocked ${channel}`;
    } else {
      await lockChannel(interaction, channel);
      message = `Succesfully locked ${channel}`;
    }
  } catch (error) {
    message = `An error occurred while editing permissions for ${channel}: ${error}`;
  }

  return interaction.editReply(message);
};

export default channel;
