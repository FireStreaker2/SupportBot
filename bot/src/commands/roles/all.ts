import { CommandInteraction, EmbedBuilder, GuildMember } from "discord.js";

const all = async (interaction: CommandInteraction) => {
  const embed = new EmbedBuilder();

  const role = interaction.options.get("role")?.role;
  const members = interaction.guild?.members.cache.map(
    (member) => member,
  ) as GuildMember[];

  try {
    for (const member of members) await member.roles.add(role?.id as string);

    embed
      .setColor(0x00ff00)
      .setTitle("Sucess")
      .setDescription(
        `Succesfully gave role ${role} to ${members.length} members`,
      );
  } catch (error) {
    embed
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        `An error occurred whilst trying to assign a role to everyone: ${error}`,
      );
  }

  return interaction.editReply({ embeds: [embed] });
};

export default all;
