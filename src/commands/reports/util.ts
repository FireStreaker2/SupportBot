import { ReportInfo } from "@/types";
import { EmbedBuilder, Guild, TextChannel } from "discord.js";
import { reportConfig } from "@/config";

const report = async (guild: Guild, info: ReportInfo) => {
  const channel = guild.channels.cache.get(reportConfig[guild?.id as string]);

  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("New Report!")
    .setDescription("A new report has been filed!")
    .addFields(
      { name: "User", value: `<@${info.user}>` },
      { name: "Reason", value: info.reason },
      { name: "Time", value: new Date().toString() },
    );

  return (channel as TextChannel)?.send({ embeds: [embed] });
};

export { report };
