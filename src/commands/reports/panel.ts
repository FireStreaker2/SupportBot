import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { reportConfig } from "@/config";
import { report } from "./util";

const panel = async (interaction: CommandInteraction) => {
  const guild = interaction.guild as Guild;

  if (!reportConfig[guild.id]) {
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        "This server has not been properly setup yet! Please have an admin run the ``/report setup`` command to continue!",
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
      .setCustomId("report")
      .setLabel(interaction.options.get("btitle")?.value as string)
      .setStyle(ButtonStyle.Danger),
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
      const modal = new ModalBuilder()
        .setCustomId("reportModal")
        .setTitle("User Report");

      const userInput = new TextInputBuilder()
        .setCustomId("userInput")
        .setLabel("ID of the user to report")
        .setStyle(TextInputStyle.Short);

      const descriptionInput = new TextInputBuilder()
        .setCustomId("descriptionInput")
        .setLabel("Description/Reason")
        .setStyle(TextInputStyle.Paragraph);

      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(userInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          descriptionInput,
        ),
      );

      await i.showModal(modal);

      const submitted = await i.awaitModalSubmit({
        filter: (interaction) =>
          interaction.customId === "reportModal" &&
          interaction.user.id === i.user.id,
        time: 120000,
      });

      if (submitted) {
        report(interaction.guild as Guild, {
          user: submitted.fields.getTextInputValue("userInput"),
          reason: submitted.fields.getTextInputValue("descriptionInput"),
        });
        
        await submitted.reply({
          content: "User has been succesfully reported.",
          ephemeral: true,
        });
      }
    });

    collector?.on("end", () => console.warn("Report collector stopped"));
  }
};

export default panel;
