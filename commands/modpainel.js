const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

const { STAFF_ROLE } = require('../config/modConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modpanel')
    .setDescription('Painel de moderação'),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(STAFF_ROLE)) {
      return interaction.reply({
        content: '❌ Apenas staff pode usar',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('⚙️ PAINEL DE MODERAÇÃO')
      .setDescription('Escolha uma ação abaixo:')
      .setColor('#ff0000');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('mod_ban')
        .setLabel('🔨 Ban')
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId('mod_kick')
        .setLabel('👢 Kick')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('mod_mute')
        .setLabel('🔇 Mute')
        .setStyle(ButtonStyle.Primary)
    );

    interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};