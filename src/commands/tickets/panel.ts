import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  PermissionsBitField,
} from "discord.js";
import { cooldowns, ticketConfig } from "@/config";
import { logClosedTicket } from "./util";

const panel = async (interaction: CommandInteraction) => {
  const guild = interaction.guild as Guild;

  if (!ticketConfig[guild.id]) {
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("Error")
      .setDescription(
        "This server has not been properly setup yet! Please run the ``/tickets setup`` command to continue!",
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
      .setCustomId("create")
      .setLabel(interaction.options.get("btitle")?.value as string)
      .setStyle(ButtonStyle.Primary),
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

    const supportEmbed = new EmbedBuilder()
      .setColor(0x000)
      .setTitle("Help Requested!")
      .setDescription(`${interaction.user.globalName} needs help!`)
      .addFields(
        {
          name: "Wait Patiently",
          value: "Please wait while the support team gets to you.",
        },
        {
          name: "Help not recieved?",
          value: `Please mention the support role (<@&${
            ticketConfig[guild.id].role
          }>).`,
        },
      );

    collector?.on("collect", async (i) => {
      const now = Date.now();
      if (
        cooldowns[interaction.user.id] &&
        cooldowns[interaction.user.id] > now
      ) {
        await i.reply({
          content: "You are on cooldown! Please try again later.",
          ephemeral: true,
        });

        return;
      }

      try {
        const ticket = await guild.channels.create({
          name: `ticket-${interaction.user.id}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
              ],
            },
            {
              id: guild.roles.everyone,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
          ],
          parent: guild.channels.cache.find(
            (channel) =>
              channel.type === ChannelType.GuildCategory &&
              channel.id === ticketConfig[guild.id as string].category,
          )?.id,
        });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("close")
            .setLabel("Close Ticket")
            .setStyle(ButtonStyle.Danger),
        );

        const message = await ticket.send({
          embeds: [supportEmbed],
          components: [row],
          content: `<@&${ticketConfig[guild.id].role}>, <@${
            interaction.user.id
          }> needs support!`,
        });

        await message.pin();

        await i.reply({
          content: `Ticket created: ${ticket}`,
          ephemeral: true,
        });

        cooldowns[interaction.user.id] = now + 300000;

        if (message) {
          const closeCollector = message.createMessageComponentCollector({
            time: 0,
          });

          closeCollector?.on("collect", async (i) => {
            await i.reply("Closing ticket in 10 seconds.");

            await new Promise((resolve) => setTimeout(resolve, 10000));

            logClosedTicket(interaction, guild, ticket);
            await i.channel?.delete();
          });
        }
      } catch (error) {
        await i.reply({
          content: `Failed to create ticket. Please try again later. ${error}`,
          ephemeral: true,
        });
      }
    });

    collector?.on("end", () => console.warn("Ticket collector stopped"));
  }
};

export default panel;
