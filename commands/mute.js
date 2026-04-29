const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { STAFF_ROLE, LOG_CHANNEL_ID } = require('../config/modConfig');

function parseTempo(tempo) {
  const regex = /^(\d+)(m|h|d)$/;
  const match = tempo.match(regex);

  if (!match) return null;

  const valor = parseInt(match[1]);
  const unidade = match[2];

  if (unidade === 'm') return valor * 60 * 1000;
  if (unidade === 'h') return valor * 60 * 60 * 1000;
  if (unidade === 'd') return valor * 24 * 60 * 60 * 1000;

  return null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutar usuário (timeout oficial)')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('tempo')
        .setDescription('Tempo (10m, 1h, 1d)')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('motivo')
        .setDescription('Motivo')
        .setRequired(true)
    ),

  async execute(interaction) {

    // 🔒 PERMISSÃO
    if (!interaction.member.roles.cache.has(STAFF_ROLE)) {
      return interaction.reply({
        content: '❌ Sem permissão',
        ephemeral: true
      });
    }

    const user = interaction.options.getUser('usuario');
    const tempoInput = interaction.options.getString('tempo');
    const motivo = interaction.options.getString('motivo');

    const tempoMs = parseTempo(tempoInput);

    if (!tempoMs) {
      return interaction.reply({
        content: '❌ Tempo inválido (use 10m, 1h, 1d)',
        ephemeral: true
      });
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: '❌ Usuário não encontrado',
        ephemeral: true
      });
    }

    try {

      // 🔇 TIMEOUT
      await member.timeout(tempoMs, motivo);

      await interaction.reply({
        content: `🔇 ${user.tag} mutado por ${tempoInput}`,
        ephemeral: true
      });

      // =============================
      // 📩 DM PARA USUÁRIO
      // =============================
      try {
        const dmEmbed = new EmbedBuilder()
          .setTitle('🔇 Você foi mutado')
          .setColor('#ff0000')
          .addFields(
            { name: '📄 Motivo', value: motivo },
            { name: '⏱️ Tempo', value: tempoInput },
            { name: '👮 Staff', value: interaction.user.tag }
          )
          .setFooter({ text: 'Caverna dos Gamers' })
          .setTimestamp();

        await user.send({ embeds: [dmEmbed] });

      } catch {
        console.log('⚠️ Não foi possível enviar DM');
      }

      // =============================
      // 📊 LOG NO CANAL
      // =============================
      const logChannel = await interaction.guild.channels.fetch(LOG_CHANNEL_ID).catch(() => null);

      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('🔇 Usuário Mutado')
          .setColor('#ff0000')
          .addFields(
            { name: '👤 Usuário', value: `${user.tag} (${user.id})` },
            { name: '👮 Staff', value: `${interaction.user.tag}` },
            { name: '⏱️ Tempo', value: tempoInput },
            { name: '📄 Motivo', value: motivo }
          )
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] });
      }

    } catch (err) {
      console.error('❌ ERRO TIMEOUT:', err);

      return interaction.reply({
        content: '❌ Erro ao mutar usuário.',
        ephemeral: true
      });
    }
  }
};