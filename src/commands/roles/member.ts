import { CommandInteraction, EmbedBuilder, GuildMember } from "discord.js";

// TODO: make it so that you can remove a role
const member = async (interaction: CommandInteraction) => {
  const embed = new EmbedBuilder();

  try {
    const member = interaction.options.get("user")?.member as GuildMember;
    const role = interaction.options.get("role")?.role;

    if (member.roles.cache.has(role?.id as string))
      throw new Error("User already has this role!");

    await member.roles.add(role?.id as string);

    embed
      .setColor(0x00ff00)
      .setTitle("Sucess")
      .setDescription(`Succesfully gave role ${role} to ${member}`);
  } catch (error) {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        `An error occurred whilst trying to assign a role: ${error}`,
      );
  }

  return interaction.editReply({ embeds: [embed] });
};

export default member;
