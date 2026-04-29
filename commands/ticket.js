const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

const CARGO_STAFF = '1390278164122566736';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abre o sistema de tickets (STAFF ONLY)'),

  async execute(interaction) {

    const member = interaction.member;

    // 🔒 BLOQUEIO DE STAFF
    if (!member.roles.cache.has(CARGO_STAFF)) {
      return interaction.reply({
        content: '❌ Apenas a STAFF pode usar esse comando.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🎫 SISTEMA DE TICKETS')
      .setDescription(
        'Escolha uma categoria:\n\n' +
        '🛠️ Suporte\n' +
        '❓ Dúvidas\n' +
        '🚨 Denúncias'
      )
      .setColor('#ff0000')
      .setImage('https://i.postimg.cc/8CYScdPd/Chat-GPT-Image-28-de-abr-de-2026-12-36-40.png')
      .setThumbnail('https://i.postimg.cc/D0KR4xV5/Chat-GPT-Image-28-de-abr-de-2026-10-38-43.png')
      .setFooter({ text: 'CAVERNA DOS GAMERS' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('ticket_menu')
      .setPlaceholder('Selecione uma categoria')
      .addOptions(
        {
          label: 'Suporte',
          value: 'suporte',
          emoji: '🛠️'
        },
        {
          label: 'Dúvidas',
          value: 'duvidas',
          emoji: '❓'
        },
        {
          label: 'Denúncias',
          value: 'denuncias',
          emoji: '🚨'
        }
      );

    const row = new ActionRowBuilder().addComponents(menu);

    return interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};