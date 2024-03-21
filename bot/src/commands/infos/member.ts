import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  User,
} from "discord.js";

const member = async (interaction: CommandInteraction) => {
  const user = (interaction.options.get("member")?.member ||
    interaction.user) as User;

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setAuthor({
      name: user.displayName,
      iconURL: user.avatarURL() as string,
      url: user.avatarURL() as string,
    })
    .setDescription(`Also known as: ${user.username}#${user.discriminator}`)
    .addFields(
      {
        name: "ID",
        value: user.id,
      },
      {
        name: "Account Made",
        value: user.createdAt.toDateString(),
      },
      {
        name: "Roles",
        value: (
          interaction.guild?.members.cache.get(user.id) as GuildMember
        ).roles.cache
          .map((role) => role)
          .join(", "),
      },
    );

  return interaction.editReply({ embeds: [embed] });
};

export default member;
