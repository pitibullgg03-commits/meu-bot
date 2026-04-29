const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { STAFF_ROLE, LOG_CHANNEL_ID } = require('../config/modConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banir usuário')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuário a ser banido')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('motivo')
        .setDescription('Motivo do ban')
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
    const motivo = interaction.options.getString('motivo');

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: '❌ Usuário não encontrado.',
        ephemeral: true
      });
    }

    try {
      await member.ban({ reason: motivo });

      // ✅ Resposta
      await interaction.reply({
        content: `🔨 ${user.tag} foi banido com sucesso.`,
        ephemeral: true
      });

      // 📊 LOG
      const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setTitle('🔨 Usuário Banido')
        .setColor('#ff0000')
        .addFields(
          { name: '👤 Usuário', value: `${user.tag} (${user.id})`, inline: false },
          { name: '👮 Staff', value: `${interaction.user.tag}`, inline: false },
          { name: '📄 Motivo', value: motivo, inline: false }
        )
        .setTimestamp();

      logChannel.send({ embeds: [embed] });

    } catch (err) {
      console.error(err);

      return interaction.reply({
        content: '❌ Erro ao banir usuário.',
        ephemeral: true
      });
    }
  }
};