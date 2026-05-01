const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meutempo')
    .setDescription('📊 Veja seu tempo em call'),

  async execute(interaction) {

    const userId = interaction.user.id;

    if (!fs.existsSync('./database/users.json')) {
      return interaction.reply({
        content: '❌ Nenhum dado encontrado.',
        ephemeral: true
      });
    }

    const data = JSON.parse(fs.readFileSync('./database/users.json'));

    if (!data[userId]) {
      return interaction.reply({
        content: '❌ Você ainda não tem tempo registrado.',
        ephemeral: true
      });
    }

    const tempo = data[userId].tempo;

    const horas = Math.floor(tempo / 1000 / 60 / 60);
    const minutos = Math.floor((tempo / 1000 / 60) % 60);

    const embed = new EmbedBuilder()
      .setTitle('📊 Seu Tempo na Caverna')
      .setColor('#ff0000')
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: '⏱️ Tempo total', value: `${horas}h ${minutos}m` }
      )
      .setFooter({ text: '🔥 Continue farmando tempo!' })
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
};