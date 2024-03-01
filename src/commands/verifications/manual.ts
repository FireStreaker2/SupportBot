import {
  CommandInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
} from "discord.js";
import { verificationConfig } from "@/config";
import { logVerification } from "./util";

const manual = async (interaction: CommandInteraction) => {
  const embed = new EmbedBuilder();

  if (!verificationConfig[(interaction.guild as Guild)?.id]) {
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        "This server has not been properly setup yet! Please run the ``/verification setup`` command to continue!",
      );

    return interaction.editReply({ embeds: [embed] });
  }

  try {
    const member = interaction.options.get("user")?.member as GuildMember;

    if (
      member.roles.cache.has(
        verificationConfig[(interaction.guild as Guild)?.id].role,
      )
    )
      throw new Error("User is already verified!");

    await member.roles.add(
      verificationConfig[(interaction.guild as Guild)?.id].role,
    );

    embed
      .setColor(0x00ff00)
      .setTitle("Sucess")
      .setDescription(`Succesfully verified ${member}`);

    logVerification(interaction.guild as Guild, member);
  } catch (error) {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        `An error occurred whilst trying to verify this user: ${error}`,
      );
  }

  return interaction.editReply({ embeds: [embed] });
};

export default manual;
