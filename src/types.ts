import { CommandInteraction } from "discord.js";

interface Actions {
  [key: string]: (interaction: CommandInteraction) => Promise<any>;
}

interface TicketConfig {
  [key: string]: {
    category: string;
    role: string;
    channel: string;
  };
}

export { Actions, TicketConfig };
