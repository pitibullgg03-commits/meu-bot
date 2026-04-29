const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const CARGO_STAFF = '1390278164122566736';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('painel')
    .setDescription('Envia o painel de verificação'),

  async execute(interaction) {

    const member = interaction.member;

    // 🔒 só staff
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
};