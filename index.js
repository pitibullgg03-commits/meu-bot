require('dotenv').config();
const fs = require('fs');

const {
  Client,
  GatewayIntentBits,
  Events
} = require('discord.js');

// 🔐 TOKEN CHECK
if (!process.env.TOKEN) {
  console.error("❌ TOKEN não encontrado no ambiente");
  process.exit(1);
}

// CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// =============================
// 📦 CARREGAR COMMANDS
// =============================
client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// =============================
// 🤖 BOT ONLINE
// =============================
client.once('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

// =============================
// 👤 ENTRADA MEMBRO
// =============================
client.on(Events.GuildMemberAdd, async member => {
  console.log(`👤 Novo membro: ${member.user.tag}`);
});

// =============================
// 🎯 INTERAÇÕES
// =============================
client.on(Events.InteractionCreate, async interaction => {

  // =============================
  // 📌 SLASH COMMANDS
  // =============================
  if (interaction.isChatInputCommand()) {

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: '❌ Erro ao executar comando.',
        ephemeral: true
      });
    }
  }

  // =============================
  // 🔘 BOTÕES (VERIFICAÇÃO)
  // =============================
  if (interaction.isButton()) {

    if (interaction.customId === 'verificar') {

      const CARGO_VERIFICADO = '1498403428982853692';
      const CARGO_NAO_VERIFICADO = '1498702244734832650';
      const CARGO_EXTRA = '1364330556434944091';

      const member = interaction.member;

      try {
        await member.roles.add(CARGO_VERIFICADO);
        await member.roles.add(CARGO_EXTRA);
        await member.roles.remove(CARGO_NAO_VERIFICADO);

        return interaction.reply({
          content: '🔥 Você foi verificado com sucesso!',
          ephemeral: true
        });

      } catch (err) {
        console.log(err);

        return interaction.reply({
          content: '❌ Erro ao verificar usuário.',
          ephemeral: true
        });
      }
    }
  }
});

// =============================
// 🔑 LOGIN
// =============================
client.login(process.env.TOKEN)
  .then(() => console.log("🔑 Login realizado com sucesso"))
  .catch(err => console.error("❌ Erro no login:", err));