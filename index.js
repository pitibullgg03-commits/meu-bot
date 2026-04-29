require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  EmbedBuilder
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
// 🔑 CONFIG CARGOS
// =============================
const CARGO_VERIFICADO = '1498403428982853692';
const CARGO_NAO_VERIFICADO = '1498702244734832650';
const CARGO_EXTRA = '1364330556434944091';

// 👮 STAFF (COLOQUE O ID DO CARGO AQUI)
const CARGO_STAFF = '1390278164122566736';

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
  try {
    await member.roles.add(CARGO_NAO_VERIFICADO);
  } catch (err) {
    console.log('Erro ao adicionar cargo:', err);
  }
});

// =============================
// 🎯 INTERAÇÕES
// =============================
client.on(Events.InteractionCreate, async interaction => {

  // =============================
  // 🔥 /painel (SÓ STAFF)
  // =============================
  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === 'painel') {

      const member = interaction.member;

      // 🔒 VERIFICAÇÃO STAFF
      if (!member.roles.cache.has(CARGO_STAFF)) {
        return interaction.reply({
          content: '❌ Você não tem permissão para usar esse comando.',
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('🔥 SISTEMA DE VERIFICAÇÃO 🔥')
        .setDescription(
          '🛡️ Bem-vindo ao servidor!\n\n' +
          'Clique no botão abaixo para se verificar.\n\n' +
          '⚠️ Apenas usuários verificados podem acessar os canais.'
        )
        .setColor('#ff0000')
        .setThumbnail('https://i.postimg.cc/D0KR4xV5/Chat-GPT-Image-28-de-abr-de-2026-10-38-43.png')
        .setImage('https://i.postimg.cc/8CYScdPd/Chat-GPT-Image-28-de-abr-de-2026-12-36-40.png')
        .setFooter({ text: '🇧🇷 CAVERNA DOS GAMERS 🇧🇷' });

      const button = new ButtonBuilder()
        .setCustomId('verificar')
        .setLabel('🔒 Verificar-se')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(button);

      return interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }
  }

  // =============================
  // 🔘 BOTÃO VERIFICAR
  // =============================
  if (interaction.isButton()) {

    if (interaction.customId === 'verificar') {

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