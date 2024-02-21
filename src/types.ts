import { CommandInteraction } from "discord.js";

interface Actions {
  [key: string]: (interaction: CommandInteraction) => Promise<any>;
}

interface TicketConfig {
  [key: string]: {
    category: string;
    role: string;
  };
}

export { Actions, TicketConfig };
