import {
  CommandInteraction,
  EmbedBuilder,
  InteractionType,
  SlashCommandBuilder,
} from "discord.js";
import { readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("See all the available commands");

export const execute = async (interaction: CommandInteraction) => {
  if (
    interaction.type !== InteractionType.ApplicationCommand ||
    !interaction.isChatInputCommand()
  )
    return;

  await interaction.deferReply();

  const getCommands = (path: string) => {
    let commands: string[] = [];

    readdirSync(path).forEach((dir) => {
      if (statSync(join(path, dir)).isDirectory()) {
        commands = commands.concat(
          getCommands(join(path, dir)).map(
            (command: any) => `/${dir} /${command}`,
          ),
        );
      } else if (
        extname(dir) === ".ts" &&
        dir !== "index.ts" &&
        dir !== "util.ts"
      ) {
        const commandName = basename(dir, ".ts");
        commands.push(`/${commandName}`);
      }
    });

    return commands;
  };

  const embed = new EmbedBuilder()
    .setColor(0x000000)
    .setTitle("Help")
    .addFields(
      {
        name: "Commands",
        value: getCommands(__dirname)
          .filter(
            (command) =>
              !command.includes("/context") && command.split("/").length > 2,
          )
          .join("\n//")
          .replaceAll("//", ""),
      },
      {
        name: "Support",
        value:
          "For support, please refer to the [GitHub repository](https://github.com/FireStreaker2/SupportBot)",
      },
    );

  return interaction.editReply({ embeds: [embed] });
};
