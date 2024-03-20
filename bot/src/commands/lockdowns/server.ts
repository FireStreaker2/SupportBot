import { ChannelType, CommandInteraction } from "discord.js";
import { lockChannel, unlockChannel } from "./util";

const server = async (interaction: CommandInteraction) => {
  let message = "";

  try {
    interaction.guild?.channels.cache.forEach(async (channel) => {
      if (channel.type !== ChannelType.GuildText) return;

      if (channel.topic?.includes("This channel is currently locked.")) {
        await unlockChannel(interaction, channel);
        message = `Succesfully unlocked every channel`;
      } else {
        await lockChannel(interaction, channel);
        message = `Succesfully locked every channel`;
      }
    });
  } catch (error) {
    message = `An error occurred while editing permissions for the server: ${error}`;
  }

  return interaction.editReply(message);
};

export default server;
