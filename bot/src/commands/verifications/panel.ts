import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
} from "discord.js";
import { verificationConfig } from "@/config";
import { logVerification } from "./util";

const panel = async (interaction: CommandInteraction) => {
  const guild = interaction.guild as Guild;

  if (!verificationConfig[guild.id]) {
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        "This server has not been properly setup yet! Please run the ``/verification setup`` command to continue!",
      );

    return interaction.editReply({ embeds: [embed] });
  }

  const embed = new EmbedBuilder()
    .setColor(
      parseInt(interaction.options.get("color")?.value as string) || 0x000,
    )
    .setTitle(interaction.options.get("title")?.value as string)
    .setDescription(interaction.options.get("description")?.value as string);

  const thumbnail = interaction.options.get("thumbnail");
  if (thumbnail) embed.setThumbnail(thumbnail.attachment?.url as string);

  const image = interaction.options.get("image");
  if (image) embed.setImage(image.attachment?.url as string);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("verify")
      .setLabel(interaction.options.get("btitle")?.value as string)
      .setStyle(ButtonStyle.Success),
  );

  const response = await interaction.channel?.send({
    embeds: [embed],
    components: [row],
  });

  await interaction.editReply("Panel has been succesfully created!");

  if (response) {
    const collector = response.createMessageComponentCollector({
      time: 0,
    });

    collector?.on("collect", async (i) => {
      let message;

      try {
        const member = interaction.member as GuildMember;

        await member.roles.add(
          verificationConfig[(interaction.guild as Guild)?.id].role,
        );

        if (
          member.roles.cache.has(
            verificationConfig[(interaction.guild as Guild)?.id].role,
          )
        )
          throw new Error("You are already verified!");

        message = "You have been succesfully verified!";

        logVerification(interaction.guild as Guild, member);
      } catch (error) {
        message = `An error occurred whilst trying to verify you: ${error}`;
      }

      await i.reply({ content: message, ephemeral: true });
    });

    collector?.on("end", () => console.warn("Verification collector stopped"));
  }
};

export default panel;
