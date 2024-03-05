import {
  ApplicationCommandType,
  CommandInteraction,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  Guild,
  GuildMember,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { verificationConfig } from "@/config";
import { logVerification } from "./verifications/util";

export const data = new ContextMenuCommandBuilder()
  .setName("verify")
  .setType(ApplicationCommandType.User);

export const execute = async (interaction: CommandInteraction) => {
  const embed = new EmbedBuilder();

  if (!verificationConfig[(interaction.guild as Guild)?.id]) {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        "This server has not been properly setup yet! Please run the ``/verification setup`` command to continue!",
      );

    return interaction.reply({ embeds: [embed] });
  }

  try {
    const member = interaction.guild?.members.resolve(
      (interaction as UserContextMenuCommandInteraction).targetUser.id,
    ) as GuildMember;

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

  return interaction.reply({ embeds: [embed] });
};
