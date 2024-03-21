import { EmbedBuilder, Guild, GuildMember, TextChannel } from "discord.js";
import { verificationConfig } from "@/config";

const logVerification = async (guild: Guild, user: GuildMember) => {
  const channel = guild.channels.cache.get(
    verificationConfig[guild?.id as string].channel,
  );

  const embed = new EmbedBuilder()
    .setTitle("User Verified")
    .setDescription("A user has been verified!")
    .addFields(
      {
        name: "User",
        value: `${user} (${user.displayName})`,
      },
      {
        name: "Time",
        value: new Date().toString(),
      },
    );

  return (channel as TextChannel)?.send({ embeds: [embed] });
};

export { logVerification };
