import { REST, Routes } from "discord.js";
import { commands } from "./commands";
import { TOKEN, CLIENT_ID } from "./config";

const rest = new REST({ version: "10" }).setToken(TOKEN);

export const deploy = async (id: string) => {
  try {
    const data = Object.values(commands).map((command) => command.data);

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, id), {
      body: data,
    });
  } catch (error) {
    console.error(error);
  }
};
