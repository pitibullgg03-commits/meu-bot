const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { STAFF_ROLE, LOG_CHANNEL_ID, MUTE_ROLE } = require('../config/modConfig');

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
    .setDescription('Mutar usuário temporariamente')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuário a ser mutado')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('tempo')
        .setDescription('Tempo (ex: 10m, 1h, 1d)')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('motivo')
        .setDescription('Motivo do mute')
        .setRequired(true)
    ),

  async execute(interaction) {

    // 🔒 Permissão
    if (!interaction.member.roles.cache.has(STAFF_ROLE)) {
      return interaction.reply({
        content: '❌ Você não tem permissão.',
        ephemeral: true
      });
    }

    const user = interaction.options.getUser('usuario');
    const tempoInput = interaction.options.getString('tempo');
    const motivo = interaction.options.getString('motivo');

    const tempoMs = parseTempo(tempoInput);

    if (!tempoMs) {
      return interaction.reply({
        content: '❌ Tempo inválido. Use: 10m, 1h ou 1d',
        ephemeral: true
      });
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: '❌ Usuário não encontrado.',
        ephemeral: true
      });
    }

    try {
      // 🔇 aplicar mute
      await member.roles.add(MUTE_ROLE);

      await interaction.reply({
        content: `🔇 ${user.tag} foi mutado por ${tempoInput}`,
        ephemeral: true
      });

      // 📊 LOG
      const logChannel = await interaction.guild.channels.fetch(LOG_CHANNEL_ID).catch(() => null);

      if (logChannel) {
        const embed = new EmbedBuilder()
          .setTitle('🔇 Usuário Mutado')
          .setColor('#ff0000')
          .addFields(
            { name: '👤 Usuário', value: `${user.tag} (${user.id})` },
            { name: '👮 Staff', value: `${interaction.user.tag}` },
            { name: '⏱️ Tempo', value: tempoInput },
            { name: '📄 Motivo', value: motivo }
          )
          .setTimestamp();

        logChannel.send({ embeds: [embed] });
      }

      // ⏳ DESMUTE AUTOMÁTICO
      setTimeout(async () => {
        try {
          await member.roles.remove(MUTE_ROLE);

          const logChannel = await interaction.guild.channels.fetch(LOG_CHANNEL_ID).catch(() => null);

          if (logChannel) {
            const embed = new EmbedBuilder()
              .setTitle('🔊 Usuário Desmutado')
              .setColor('#00ff00')
              .addFields(
                { name: '👤 Usuário', value: `${user.tag}` },
                { name: '⏱️ Tempo cumprido', value: tempoInput }
              )
              .setTimestamp();

            logChannel.send({ embeds: [embed] });
          }

        } catch (err) {
          console.log('Erro ao desmutar:', err);
        }
      }, tempoMs);

    } catch (err) {
      console.error(err);

      return interaction.reply({
        content: '❌ Erro ao mutar usuário.',
        ephemeral: true
      });
    }
  }
};