import {
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";

const role = async (interaction: CommandInteraction) => {
  const role = interaction.options.get("role")?.role;

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle(role?.name as string)
    .setDescription(`ID: ${role?.id}`)
    .addFields(
      {
        name: "Has Admin?",
        value: `${(role?.permissions as Readonly<PermissionsBitField>).has([
          PermissionsBitField.Flags.Administrator,
        ])}`,
      },
      { name: "Has Icon?", value: role?.icon ? "true" : "false" },
    );

  return interaction.editReply({ embeds: [embed] });
};

export default role;
