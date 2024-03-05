import {
  CommandInteraction,
  EmbedBuilder,
  Guild,
  TextChannel,
} from "discord.js";
import { verificationConfig } from "@/config";

const lockChannel = async (
  interaction: CommandInteraction,
  channel: TextChannel,
) => {
  const embed = new EmbedBuilder();

  if (!verificationConfig[(interaction.guild as Guild)?.id]) {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        "This server has not been properly setup yet! Please run the ``/verification setup`` command to continue!",
      );

    return interaction.editReply({ embeds: [embed] });
  }

  await channel?.permissionOverwrites.edit(
    verificationConfig[(interaction.guild as Guild)?.id].role,
    {
      SendMessages: false,
    },
  );

  await channel.setTopic(
    (channel.topic || "") + " This channel is currently locked.",
  );

  embed
    .setColor(0xff0000)
    .setTitle("Channel Locked")
    .setDescription(`This channel has been locked by ${interaction.user}`);

  return channel.send({ embeds: [embed] });
};

const unlockChannel = async (
  interaction: CommandInteraction,
  channel: TextChannel,
) => {
  const embed = new EmbedBuilder();

  if (!verificationConfig[(interaction.guild as Guild)?.id]) {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        "This server has not been properly setup yet! Please run the ``/verification setup`` command to continue!",
      );

    return interaction.editReply({ embeds: [embed] });
  }

  await channel?.permissionOverwrites.edit(
    verificationConfig[(interaction.guild as Guild)?.id].role,
    {
      SendMessages: true,
    },
  );

  channel.setTopic(
    channel.topic?.replaceAll("This channel is currently locked.", "") as
      | string
      | null,
  );

  embed
    .setColor(0x00ff00)
    .setTitle("Channel Unlocked")
    .setDescription(`This channel has been unlocked by ${interaction.user}`);

  return channel.send({ embeds: [embed] });
};

export { lockChannel, unlockChannel };
