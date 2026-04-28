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

// 🔐 CHECAGEM DE TOKEN (EVITA CRASH NO RENDER)
if (!process.env.TOKEN) {
  console.error("❌ TOKEN não encontrado no ambiente (Render Environment Variables)");
  process.exit(1);
}

// CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// IDs dos cargos
const CARGO_VERIFICADO = '1498403428982853692';
const CARGO_NAO_VERIFICADO = '1498702244734832650';
const CARGO_EXTRA = '1364330556434944091';

// BOT ONLINE
client.once('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

// ENTRADA DE MEMBRO
client.on(Events.GuildMemberAdd, async member => {
  try {
    await member.roles.add(CARGO_NAO_VERIFICADO);
  } catch (err) {
    console.log('Erro ao adicionar cargo:', err);
  }
});

// =============================
// 🔥 SLASH COMMAND /painel
// =============================
client.on(Events.InteractionCreate, async interaction => {

  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'painel') {

      const embed = new EmbedBuilder()
        .setTitle('🔥 SISTEMA DE VERIFICAÇÃO 🔥')
        .setDescription(
          '🛡️ **Bem-vindo ao servidor!**\n\n' +
          'Clique no botão abaixo para se verificar e liberar o acesso.\n\n' +
          '⚠️ Apenas usuários verificados podem acessar os canais.'
        )
        .setColor('#ff0000')
        .setThumbnail('https://i.postimg.cc/D0KR4xV5/Chat-GPT-Image-28-de-abr-de-2026-10-38-43.png')
        .setImage('https://i.postimg.cc/8CYScdPd/Chat-GPT-Image-28-de-abr-de-2026-12-36-40.png')
        .setFooter({ text: '🇧🇷 CAVERNA DOS GAMERS 🇧🇷 • Segurança ativa 🔒' });

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
  // 🔥 BOTÃO VERIFICAR
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
        console.log('Erro ao verificar usuário:', err);

        return interaction.reply({
          content: '❌ Erro ao aplicar cargos.',
          ephemeral: true
        });
      }
    }
  }
});

// =============================
// 🔑 LOGIN SEGURO
// =============================
client.login(process.env.TOKEN)
  .then(() => {
    console.log("🔑 Login realizado com sucesso");
  })
  .catch(err => {
    console.error("❌ Erro no login do bot:", err);
  });