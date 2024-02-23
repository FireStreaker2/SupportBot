import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  UserResolvable,
} from "discord.js";

// TODO: add softban and duration of ban, also unban
const ban = async (interaction: CommandInteraction) => {
  const embed = new EmbedBuilder();
  try {
    const user = interaction.options.get("user")?.member;
    await interaction.guild?.members.ban(user as UserResolvable, {
      reason:
        (interaction.options.get("reason")?.value as string) ||
        "No reason provided",
    });

    embed
      .setColor(0x00ff00)
      .setTitle("Sucess")
      .setDescription(`Succesfully banned <@${(user as GuildMember)?.id}>`);
  } catch (error) {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        `An error occurred whilst trying to ban this user: ${error}`,
      );
  }

  return interaction.editReply({ embeds: [embed] });
};

export default ban;
