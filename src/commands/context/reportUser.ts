import {
  ApplicationCommandType,
  CommandInteraction,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  Guild,
  GuildMember,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { reportConfig } from "@/config";
import { report } from "../reports/util";

export const data = new ContextMenuCommandBuilder()
  .setName("reportUser")
  .setType(ApplicationCommandType.User);

export const execute = async (interaction: CommandInteraction) => {
  const embed = new EmbedBuilder();

  if (!reportConfig[(interaction.guild as Guild)?.id]) {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        "This server has not been properly setup yet! Please have an admin run the ``/report setup`` command to continue!",
      );

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  report(interaction.guild as Guild, {
    user: (
      interaction.guild?.members.resolve(
        (interaction as UserContextMenuCommandInteraction).targetUser.id,
      ) as GuildMember
    ).id,
    reason: "N/A",
  });

  embed
    .setColor(0x00ff00)
    .setTitle("Succesfully Reported!")
    .setDescription("User has been sucesfully reported.");

  return interaction.reply({ embeds: [embed], ephemeral: true });
};
