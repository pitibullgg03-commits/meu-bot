const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abre o painel de tickets'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('🎫 SISTEMA DE TICKETS')
      .setDescription('Clique no botão para abrir um ticket.')
      .setColor('#ffcc00');

    const button = new ButtonBuilder()
      .setCustomId('open_ticket')
      .setLabel('🎫 Abrir Ticket')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};