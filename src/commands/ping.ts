import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Check if the bot is working");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.reply("Pong!");
};
