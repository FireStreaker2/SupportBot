import { CommandInteraction, EmbedBuilder, Guild } from "discord.js";
import { reportConfig } from "@/config";
import { report } from "./util";

const manual = async (interaction: CommandInteraction) => {
  const embed = new EmbedBuilder();

  if (!reportConfig[(interaction.guild as Guild)?.id]) {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        "This server has not been properly setup yet! Please have an admin run the ``/report setup`` command to continue!",
      );

    return interaction.editReply({ embeds: [embed] });
  }

  report(interaction.guild as Guild, {
    user: interaction.options.get("user")?.user?.id as string,
    reason: interaction.options.get("reason")?.value as string,
  });

  embed
    .setColor(0x00ff00)
    .setTitle("Succesfully Reported!")
    .setDescription("User has been sucesfully reported.");

  return interaction.editReply({ embeds: [embed] });
};

export default manual;
