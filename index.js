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
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates // 🔥 IMPORTANTE PRO SISTEMA DE CALL
  ]
});

// 🔥 ATIVAR SISTEMA DE CALL (AQUI É O LUGAR CERTO)
require('./events/voiceLevels')(client);

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
// 🧠 CONFIG
// =============================
const CARGO_VERIFICADO = '1498403428982853692';
const CARGO_NAO_VERIFICADO = '1498702244734832650';
const CARGO_STAFF = '1390278164122566736';
const CATEGORY_ID = '1499028834153140284';

// 📊 LOG CHANNEL
const LOG_CHANNEL_ID = '1475244668643180665';

// =============================
// 🤖 BOT ONLINE
// =============================
client.once('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

// =============================
// 🎯 INTERAÇÕES
// =============================
client.on(Events.InteractionCreate, async interaction => {

  // 📌 SLASH COMMANDS
  if (interaction.isChatInputCommand()) {

    const command = client.commands.get(interaction.commandName);

    if (command) {
      try {
        return await command.execute(interaction);
      } catch (err) {
        console.error(err);
        return interaction.reply({
          content: '❌ Erro ao executar comando.',
          ephemeral: true
        });
      }
    }
  }

  // 🔘 VERIFICAÇÃO
  if (interaction.isButton()) {

    if (interaction.customId === 'verificar') {

      const member = interaction.member;

      try {
        await member.roles.add(CARGO_VERIFICADO);
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

  // 🎫 TICKET SYSTEM
  if (interaction.isStringSelectMenu()) {

    if (interaction.customId === 'ticket_menu') {

      const option = interaction.values[0];
      const member = interaction.member;
      const guild = interaction.guild;

      const channel = await guild.channels.create({
        name: `ticket-${member.user.username}`.toLowerCase(),
        type: 0,
        parent: CATEGORY_ID,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['ViewChannel']
          },
          {
            id: member.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          },
          {
            id: CARGO_STAFF,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          }
        ]
      });

      let titulo = '';

      if (option === 'suporte') titulo = '🛠️ SUPORTE';
      if (option === 'duvidas') titulo = '❓ DÚVIDAS';
      if (option === 'denuncias') titulo = '🚨 DENÚNCIA';

      await channel.send({
        content: `<@${member.id}> | <@&${CARGO_STAFF}>`,
        embeds: [
          {
            title: `${titulo} - Ticket aberto`,
            description: 'Explique seu problema e aguarde a staff.',
            color: 0xff0000
          }
        ]
      });

      return interaction.reply({
        content: `🎫 Ticket criado com sucesso: ${channel}`,
        ephemeral: true
      });
    }
  }
});

// =============================
// 🗑️ LOG DE TICKET DELETADO
// =============================
client.on(Events.ChannelDelete, async channel => {

  try {

    const logChannel = await channel.guild.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
    if (!logChannel) return;

    logChannel.send({
      embeds: [
        {
          title: '🗑️ Ticket Fechado',
          description: `📁 Nome: **${channel.name}**\n🆔 ID: ${channel.id}`,
          color: 0xff0000,
          timestamp: new Date()
        }
      ]
    });

  } catch (err) {
    console.log('Erro no log:', err);
  }
});

// =============================
// 🔑 LOGIN
// =============================
client.login(process.env.TOKEN)
  .then(() => console.log("🔑 Login realizado com sucesso"))
  .catch(err => console.error("❌ Erro no login:", err));