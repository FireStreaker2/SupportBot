![SupportBot](https://socialify.git.ci/FireStreaker2/SupportBot/image?description=1&forks=1&issues=1&language=1&name=1&owner=1&pattern=Solid&pulls=1&stargazers=1&theme=Dark)

# About

SupportBot is a discord bot made using [discord.js](https://discord.js.org/) and [typescript](https://www.typescriptlang.org/), using [bun](https://bun.sh/) as the runtime. It improves the overall environment of your server, making it more easy as a moderator.

# Features

- Fully asynchronous
- Moderation commands
- Info commands
- Verification integration
- Ticket integration
- Role integration
- Report integration
- Lockdown integration

# Roadmap

SupportBot is still currently in development! For a list of unfinished things that are planned to be added, please refer to #1.

# Usage

## Notice

There is currently no publicly hosted instance that can directly be invited to your server, which means you will have to selfhost it. For more info, please move onto the next section.

## Setup

To get started, clone the repo and make sure you have [bun](https://bun.sh/) installed.

```bash
$ git clone https://github.com/FireStreaker2/SupportBot.git
$ cd SupportBot
$ bun i
$ cp .env.example .env
$ bun start
```

## Configuration

Currently, hosting SupportBot only requires setting two environment variables, both of which are easily found in the [discord developer panel](https://discord.com/developers).

- `TOKEN`: the token of the discord bot
- `CLIENT_ID`: the id of the discord bot

## Mass Use

If you are selfhosting this and have the bot in many servers, consider implementing [sharding](https://discordjs.guide/sharding/#when-to-shard). Note that this will only be required at ~2500 servers.

# Contributing

If you would like to contribute, you can [fork the repo](https://github.com/FireStreaker2/SupportBot/fork) and [make a PR](https://github.com/FireStreaker2/SupportBot/compare).

# License

[MIT](https://github.com/FireStreaker2/SupportBot/blob/main/LICENSE)
