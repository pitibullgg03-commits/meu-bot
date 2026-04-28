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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const CARGO_VERIFICADO = '1498403428982853692';
const CARGO_NAO_VERIFICADO = '1498702244734832650';
const CARGO_EXTRA = '1364330556434944091';

client.once('ready', () => {
  console.log('Bot PRO ligado!');
});


// 👤 Quando alguém entra
client.on(Events.GuildMemberAdd, member => {
  member.roles.add(CARGO_NAO_VERIFICADO);
});


// 📩 Painel de verificação
client.on(Events.MessageCreate, async message => {
  if (message.content === '!painel') {

    const embed = new EmbedBuilder()
      .setTitle('🔥 SISTEMA DE VERIFICAÇÃO 🔥')
      .setDescription('🛡️ **Bem-vindo ao servidor!**\n\nPara liberar o acesso completo, clique no botão abaixo.\n\n⚠️ Apenas usuários verificados podem acessar os canais.')
      .setColor('#ff0000')
      .setThumbnail('https://i.postimg.cc/D0KR4xV5/Chat-GPT-Image-28-de-abr-de-2026-10-38-43.png')
      .setImage('https://i.postimg.cc/8CYScdPd/Chat-GPT-Image-28-de-abr-de-2026-12-36-40.png')
      .setFooter({ text: '🇧🇷 𝐂𝐀𝐕𝐄𝐑𝐍𝐀 𝐃𝐎𝐒 𝐆𝐀𝐌𝐄𝐑𝐒 🇧🇷 • Segurança ativa 🔒' });

    const button = new ButtonBuilder()
      .setCustomId('verificar')
      .setLabel('🚀 Verificar-se')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});


// 🔥 Clique no botão
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'verificar') {

    const member = interaction.member;

    await member.roles.add(CARGO_VERIFICADO);
    await member.roles.add(CARGO_EXTRA);
    await member.roles.remove(CARGO_NAO_VERIFICADO);

    await interaction.reply({
      content: '🔥 Você foi verificado com sucesso!',
      ephemeral: true
    });
  }
});

client.login('MTQ5ODY3MzYxOTk2MDg2MDgxNA.GbtxxU.Xtbt4-XJRBfLG6qjzva1rCVtAaaqdy1u0JIyqM');
