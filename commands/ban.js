const { SlashCommandBuilder } = require('discord.js');
const { STAFF_ROLE } = require('../config/modConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banir usuário')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('motivo')
        .setDescription('Motivo')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(STAFF_ROLE)) {
      return interaction.reply({ content: '❌ Sem permissão', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo');

    const member = await interaction.guild.members.fetch(user.id);

    await member.ban({ reason: motivo });

    interaction.reply({ content: `✅ ${user.tag} banido`, ephemeral: true });
  }
};