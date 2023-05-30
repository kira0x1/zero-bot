import Discord from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import * as dotenv from "dotenv";
dotenv.config();

const intents = new Discord.IntentsBitField();
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildVoiceStates,
  ],
});

client.login(process.env.TOKEN);

client.on("ready", async () => {
  console.log(`logged in as ${client.user?.username}`);
});

const joinvcCommand = new Discord.SlashCommandBuilder();
joinvcCommand.setName("joinvc");
joinvcCommand.setDescription("Joins vc :3");

const commands = [{ name: "joinvc", description: "Joins vc :3" }];
const rest = new Discord.REST({ version: "10" }).setToken(
  process.env.TOKEN || ""
);

async function init() {
  try {
    await rest.put(
      Discord.Routes.applicationCommands(process.env.CLIENT_ID || ""),
      { body: commands }
    );
  } catch (error) {
    console.error(error);
  }
}

async function joinVc(interaction: Discord.Interaction) {
  const guild = interaction.guild;
  const member = await guild?.members.fetch(interaction.user);
  if (member?.voice) {
    const vc = member.voice.channel;
    if (vc === null) return;

    const connection = await joinVoiceChannel({
      channelId: vc.id,
      guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator,
    });
  }
}

client.on("interactionCreate", (interaction) => {
  console.log(interaction);
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "joinvc") {
    joinVc(interaction);
  }
});

init();
