const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const rolesConfig = require('../config/callRoles');

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

    const horasTotal = tempo / 1000 / 60 / 60;

    // 🔥 descobrir cargo atual e próximo
    let cargoAtual = 'Nenhum';
    let proximoCargo = null;

    for (let i = 0; i < rolesConfig.length; i++) {

      if (horasTotal >= rolesConfig[i].tempo) {
        cargoAtual = rolesConfig[i].nome;
      } else {
        proximoCargo = rolesConfig[i];
        break;
      }
    }

    let progresso = '';
    let faltaTexto = 'Você atingiu o nível máximo 🚀';

    if (proximoCargo) {

      const falta = (proximoCargo.tempo - horasTotal).toFixed(1);

      faltaTexto = `Faltam **${falta}h** para ${proximoCargo.nome}`;

      // 📊 barra de progresso (10 blocos)
      const porcentagem = horasTotal / proximoCargo.tempo;
      const totalBlocos = 10;
      const preenchido = Math.floor(porcentagem * totalBlocos);

      progresso = '🟥'.repeat(preenchido) + '⬛'.repeat(totalBlocos - preenchido);
    }

    const embed = new EmbedBuilder()
      .setTitle('📊 Seu Tempo na Caverna')
      .setColor('#ff0000')
      .setThumbnail(interaction.user.displayAvatarURL())

      .addFields(
        { name: '⏱️ Tempo total', value: `${horas}h ${minutos}m`, inline: true },
        { name: '🏆 Cargo atual', value: `${cargoAtual}`, inline: true },
        { name: '📈 Progresso', value: progresso || 'MAX', inline: false },
        { name: '🎯 Próximo nível', value: faltaTexto, inline: false }
      )

      .setFooter({ text: '🔥 Continue evoluindo na caverna!' })
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
};