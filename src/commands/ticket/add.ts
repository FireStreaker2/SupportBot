import {
  CommandInteraction,
  EmbedBuilder,
  GuildChannelResolvable,
  GuildMember,
  PermissionsBitField,
  TextChannel,
} from "discord.js";

const adduser = async (interaction: CommandInteraction) => {
  if (!(interaction.channel as TextChannel)?.name.includes("ticket-")) {
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription("This channel is not a ticket!");

    return interaction.editReply({ embeds: [embed] });
  }

  const member = interaction.options.get("user")?.member as GuildMember;

  if (
    member
      ?.permissionsIn(interaction.channel as GuildChannelResolvable)
      .has([
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
      ])
  ) {
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription("User has already been added to ticket!");

    return interaction.editReply({ embeds: [embed] });
  }

  await (interaction.channel as TextChannel)?.permissionOverwrites.edit(
    member?.id,
    {
      ViewChannel: true,
      SendMessages: true,
    },
  );

  const embed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle("Success")
    .setDescription(`Succesfully added <@${member?.id}> to the ticket.`);

  return interaction.editReply({
    embeds: [embed],
    content: `<@${member?.id}>`,
  });
};

export default adduser;
