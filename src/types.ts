import { CommandInteraction } from "discord.js";

interface Actions {
  [key: string]: (interaction: CommandInteraction) => Promise<any>;
}

interface Cooldowns {
  [key: string]: number;
}

interface ReactionRolePairs {
  [key: string]: string;
}

interface ReportConfig {
  [key: string]: string;
}

interface ReportInfo {
  user: string;
  reason: string;
}

interface TicketConfig {
  [key: string]: {
    category: string;
    role: string;
    channel: string;
  };
}

interface VerificationConfig {
  [key: string]: {
    role: string;
    channel: string;
  };
}

export {
  Actions,
  Cooldowns,
  ReactionRolePairs,
  ReportConfig,
  ReportInfo,
  TicketConfig,
  VerificationConfig,
};
