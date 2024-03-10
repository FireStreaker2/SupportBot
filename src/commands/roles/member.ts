import { CommandInteraction, EmbedBuilder, GuildMember } from "discord.js";

const member = async (interaction: CommandInteraction) => {
  const embed = new EmbedBuilder();

  try {
    const member = interaction.options.get("user")?.member as GuildMember;
    const role = interaction.options.get("role")?.role;
    let action = "";

    if (member.roles.cache.has(role?.id as string)) {
      await member.roles.remove(role?.id as string);
      action = "removed";
    } else {
      await member.roles.add(role?.id as string);
      action = "gave";
    }

    embed
      .setColor(0x00ff00)
      .setTitle("Sucess")
      .setDescription(`Succesfully ${action} role ${role} to ${member}`);
  } catch (error) {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        `An error occurred whilst trying to assign or remove a role: ${error}`,
      );
  }

  return interaction.editReply({ embeds: [embed] });
};

export default member;
