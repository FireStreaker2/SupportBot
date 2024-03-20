import { ReactionRolePairs } from "@/types";
import {
  CommandInteraction,
  EmbedBuilder,
  Role,
  TextChannel,
} from "discord.js";

const panel = async (interaction: CommandInteraction) => {
  const questions = [
    "What channel will this be in?",
    "What will be the title of the embed?",
    "What will be the description of the embed? Type ``{roles}`` to replace it with a list of each reaction and the role",
    "What will be the color of the embed? Enter it in hex format (ex. ``0xff0000``)",
    "What roles will be added? List them one by one like this:\n```:emoji: @role```\nWhen finished type ``done``",
  ];
  const answers: string[] = [];
  const pairs: ReactionRolePairs = {};
  let finished = true;

  await interaction.editReply(
    "Questionaire has started! Type ``cancel`` at anytime to cancel.",
  );

  for (let i = 0; i < questions.length - 1; i++) {
    const question = questions[i];
    let completed = false;

    interaction.followUp(question);

    const collector = interaction.channel?.createMessageCollector({
      filter: (m) =>
        m.author.id === interaction.user.id &&
        m.channel.id === interaction.channel?.id,
      max: 1,
      time: 60000,
    });

    await new Promise<void>((resolve, reject) => {
      collector?.on("collect", async (i) => {
        if (i.content === "cancel") {
          collector.stop();

          completed = false;
          await i.reply("Questionaire has been stoppped!");
        } else {
          answers.push(i.content);
          collector.stop();
        }
      });

      collector?.on("end", async (i) => {
        if (i.size === 0) {
          await interaction.followUp(
            "No response received within the time limit.",
          );

          completed = false;
        } else completed = true;

        resolve();
      });
    });

    if (!completed) return;
  }

  await interaction.followUp(questions[questions.length - 1]);

  const collector = interaction.channel?.createMessageCollector({
    filter: (m) =>
      m.author.id === interaction.user.id &&
      m.channel.id === interaction.channel?.id,
    time: 120000,
  });

  await new Promise<void>((resolve, reject) => {
    collector?.on("collect", async (i) => {
      if (i.content === "done") return collector.stop();
      if (i.content === "cancel") {
        collector.stop();

        finished = false;
        await i.reply("Questionaire has been stoppped!");
      } else {
        const message = i.content.split(" ");
        pairs[message[0]] = message[1];

        await i.react("✅");
      }
    });

    collector?.on("end", async (i) => {
      if (i.size === 0) {
        await interaction.followUp(
          "No response received within the time limit.",
        );
        finished = false;
      }

      resolve();
    });
  });

  if (!finished) return;

  const embed = new EmbedBuilder()
    .setTitle(answers[1])
    .setDescription(
      answers[2] === "{roles}"
        ? Object.entries(pairs)
            .map(([emoji, role]) => `${emoji}: ${role}`)
            .join("\n")
        : answers[2],
    )
    .setColor(parseInt(answers[3]));

  const channel = interaction.guild?.channels.cache.find(
    (channel) => channel.id === answers[0].replace(/<#|>/g, ""),
  ) as TextChannel;

  const message = await channel.send({ embeds: [embed] });

  for (const emoji in pairs) await message.react(emoji);

  const collecter = message.createReactionCollector({
    time: 0,
    filter: (reaction) =>
      Object.keys(pairs).includes(reaction.emoji.name as string),
  });

  collecter.on("collect", async (reaction, user) => {
    const member = await message.guild.members.fetch(user.id);

    await member.roles.add(
      message.guild.roles.cache.get(
        pairs[reaction.emoji.name as string].replace(/<@&|>/g, ""),
      ) as Role,
    );
  });

  collecter.on("remove", async (reaction, user) => {
    const member = await message.guild.members.fetch(user.id);

    await member.roles.remove(
      message.guild.roles.cache.get(
        pairs[reaction.emoji.name as string].replace(/<@&|>/g, ""),
      ) as Role,
    );
  });

  collecter.on("end", () => console.warn("Reaction role collector stopped"));

  return interaction.followUp(`Panel succesfully created in ${channel}!`);
};

export default panel;
