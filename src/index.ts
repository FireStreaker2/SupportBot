import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { commands } from "./commands";
import { deploy } from "./deploy";
import { TOKEN } from "./config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("guildCreate", async (guild) => await deploy(guild.id));

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand() && !interaction.isUserContextMenuCommand())
    return;

  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands])
    commands[commandName as keyof typeof commands].execute(interaction);
});

client.once("ready", async (client) => {
  console.log(`Logged in as ${client.user.tag}`);

  client.user.setPresence({
    activities: [
      {
        name: "you",
        type: ActivityType.Watching,
      },
    ],
    status: "idle",
  });

  if (process.env.NODE_ENV === "production") {
    for (const [id, guild] of client.guilds.cache) await deploy(guild.id);
    console.log("Refreshed commands for every server!");
  }
});

client.login(TOKEN);
