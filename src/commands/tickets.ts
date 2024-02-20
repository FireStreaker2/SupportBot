import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	CommandInteraction,
	EmbedBuilder,
	Guild,
	InteractionType,
	PermissionFlagsBits,
	PermissionsBitField,
	SlashCommandBuilder,
} from "discord.js";

// TODO: add db integration instead of storing in memory?
interface Config {
	[key: string]: {
		category: string;
		role: string;
	};
}

const config: Config = {};

export const data = new SlashCommandBuilder()
	.setName("tickets")
	.setDescription("Ticket related commands")
	.addSubcommand((subcommand) =>
		subcommand.setName("list").setDescription("See all current tickets")
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("panel")
			.setDescription("Create a new ticket panel")
			.addStringOption((option) =>
				option
					.setName("title")
					.setDescription("Title of panel embed")
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName("description")
					.setDescription("Description of panel embed")
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName("btitle")
					.setDescription("Title of button")
					.setRequired(true)
			)
			.addAttachmentOption((option) =>
				option
					.setName("thumbnail")
					.setDescription("Thumbnail image for the panel embed")
					.setRequired(false)
			)
			.addAttachmentOption((option) =>
				option
					.setName("image")
					.setDescription("Image for panel embed")
					.setRequired(false)
			)
			.addStringOption((option) =>
				option
					.setName("color")
					.setDescription("Color of the panel embed in hex. Defaults to black.")
					.setRequired(false)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("setup")
			.setDescription("Setup tickets for your server")
			.addChannelOption((option) =>
				option
					.setName("category")
					.setDescription("Category to put tickets in")
					.setRequired(true)
			)
			.addRoleOption((option) =>
				option
					.setName("role")
					.setDescription("Support role for tickets")
					.setRequired(true)
			)
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.setDMPermission(false);

// TODO: ticket rate limit and closing, split subcommands into modules
export const execute = async (interaction: CommandInteraction) => {
	if (
		interaction.type !== InteractionType.ApplicationCommand ||
		!interaction.isChatInputCommand()
	)
		return;

	const command = interaction.options.getSubcommand();
	await interaction.deferReply({ ephemeral: command === "panel" });

	if (command === "list") {
		const guild = interaction.guild as Guild;

		if (!config[guild.id]) {
			const embed = new EmbedBuilder()
				.setColor(0xff0000)
				.setTitle("Error")
				.setDescription(
					"This server has not been properly setup yet! Please run the ``/tickets setup`` command to continue!"
				);

			return interaction.editReply({ embeds: [embed] });
		}

		const category = guild.channels.cache.find(
			(channel) =>
				channel.type === ChannelType.GuildCategory &&
				channel.id === config[interaction.guild?.id as string].category
		);

		const channelsInCategory = guild.channels.cache.filter(
			(channel) =>
				channel.type === ChannelType.GuildText &&
				channel.parentId === category?.id
		);

		const tickets =
			channelsInCategory.size === 0
				? "none"
				: channelsInCategory.map((channel) => channel.name).join("\n");

		const embed = new EmbedBuilder()
			.setColor(0x000)
			.setTitle("Ticket List")
			.setDescription(tickets);

		await interaction.editReply({ embeds: [embed] });
	} else if (command === "panel") {
		const guild = interaction.guild as Guild;

		if (!config[guild.id]) {
			const embed = new EmbedBuilder()
				.setColor(0xff0000)
				.setTitle("Error")
				.setDescription(
					"This server has not been properly setup yet! Please run the ``/tickets setup`` command to continue!"
				);

			return interaction.editReply({ embeds: [embed] });
		}

		const embed = new EmbedBuilder()
			.setColor(
				parseInt(interaction.options.get("color")?.value as string) || 0x000
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
				.setStyle(ButtonStyle.Primary)
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
							config[guild.id].role
						}>).`,
					}
				);

			collector?.on("collect", async (i) => {
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
								channel.id === config[interaction.guild?.id as string].category
						)?.id,
					});

					await ticket.send({
						embeds: [supportEmbed],
						content: `<@&${config[guild.id].role}>, <@${
							interaction.user.id
						}> needs support!`,
					});

					await i.reply({
						content: `Ticket created: ${ticket}`,
						ephemeral: true,
					});
				} catch (error) {
					await i.reply({
						content: `Failed to create ticket. Please try again later. ${error}`,
						ephemeral: true,
					});
				}
			});

			collector?.on("end", () => console.warn("Ticket collector stopped"));
		}
	} else if (command === "setup") {
		config[interaction.guild?.id as string] = {
			category: interaction.options.get("category")?.value as string,
			role: interaction.options.get("role")?.value as string,
		};

		const embed = new EmbedBuilder()
			.setColor(0x00ff00)
			.setTitle("Server Setup")
			.setDescription(
				`Succesfully setup tickets for ${interaction.guild?.name}!`
			)
			.addFields(
				{
					name: "Support Category",
					value: `<#${config[interaction.guild?.id as string].category}>`,
				},
				{
					name: "Support Role",
					value: `<@&${config[interaction.guild?.id as string].role}>`,
				},
				{
					name: "Note",
					value: "Make sure all the permissions are already pre-configured!",
				}
			);

		await interaction.editReply({ embeds: [embed] });
	}
};
