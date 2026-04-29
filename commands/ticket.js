const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abre o sistema de tickets'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('🎫 SISTEMA DE TICKETS')
      .setDescription(
        'Escolha uma opção abaixo para abrir seu ticket:\n\n' +
        '🛠️ Suporte\n' +
        '❓ Dúvidas\n' +
        '🚨 Denúncias'
      )
      .setColor('#ff0000')
      .setImage('https://i.postimg.cc/CxpXNMQd/Chat-GPT-Image-29-de-abr-de-2026-10-07-31.png')
      .setThumbnail('https://i.postimg.cc/D0KR4xV5/Chat-GPT-Image-28-de-abr-de-2026-10-38-43.png')
      .setFooter({ text: '🇧🇷 CAVERNA DOS GAMERS - SISTEMA DE TICKETS' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('ticket_menu')
      .setPlaceholder('Selecione uma categoria')
      .addOptions(
        {
          label: 'Suporte',
          description: 'Problemas técnicos ou ajuda geral',
          value: 'suporte',
          emoji: '🛠️'
        },
        {
          label: 'Dúvidas',
          description: 'Perguntas gerais',
          value: 'duvidas',
          emoji: '❓'
        },
        {
          label: 'Denúncias',
          description: 'Reportar usuários ou situações',
          value: 'denuncias',
          emoji: '🚨'
        }
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};