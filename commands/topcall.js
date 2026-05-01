const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const fs = require('fs');
const rolesConfig = require('../config/callRoles');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('topcall')
    .setDescription('🏆 Ranking global com páginas'),

  async execute(interaction) {

    if (!fs.existsSync('./database/users.json')) {
      return interaction.reply({
        content: '❌ Sem dados ainda.',
        ephemeral: true
      });
    }

    const data = JSON.parse(fs.readFileSync('./database/users.json'));

    const ranking = Object.entries(data)
      .sort((a, b) => b[1].tempo - a[1].tempo);

    if (ranking.length === 0) {
      return interaction.reply({
        content: '❌ Ranking vazio.',
        ephemeral: true
      });
    }

    const medalhas = ['🥇', '🥈', '🥉'];
    const porPagina = 10;
    let pagina = 0;

    const getCargo = (horas) => {
      let nome = 'Sem cargo';

      for (const role of rolesConfig) {
        if (horas >= role.tempo) {
          nome = role.nome;
        }
      }

      return nome;
    };

    const gerarEmbed = (paginaAtual) => {

      const inicio = paginaAtual * porPagina;
      const fim = inicio + porPagina;
      const pageData = ranking.slice(inicio, fim);

      let descricao = '';

      for (let i = 0; i < pageData.length; i++) {

        const userId = pageData[i][0];
        const tempo = pageData[i][1].tempo;

        const horas = tempo / 1000 / 60 / 60;
        const horasFormatado = horas.toFixed(1);

        const posicao = inicio + i;
        const medalha = medalhas[posicao] || `**${posicao + 1}º**`;

        const cargo = getCargo(horas);

        descricao += `${medalha} <@${userId}> — **${horasFormatado}h**\n🏅 ${cargo}\n\n`;
      }

      return new EmbedBuilder()
        .setTitle('🏆 Ranking Global da Caverna')
        .setDescription(descricao || 'Sem dados')
        .setColor('#ff0000')
        .setFooter({ text: `Página ${paginaAtual + 1} / ${Math.ceil(ranking.length / porPagina)}` })
        .setTimestamp();
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('prev')
        .setLabel('⬅️')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡️')
        .setStyle(ButtonStyle.Secondary)
    );

    const msg = await interaction.reply({
      embeds: [gerarEmbed(pagina)],
      components: [row],
      fetchReply: true
    });

    const collector = msg.createMessageComponentCollector({
      time: 60000
    });

    collector.on('collect', async i => {

      if (i.user.id !== interaction.user.id) {
        return i.reply({
          content: '❌ Só quem abriu pode usar os botões.',
          ephemeral: true
        });
      }

      if (i.customId === 'prev') {
        pagina = pagina > 0 ? pagina - 1 : pagina;
      }

      if (i.customId === 'next') {
        const max = Math.floor((ranking.length - 1) / porPagina);
        pagina = pagina < max ? pagina + 1 : pagina;
      }

      await i.update({
        embeds: [gerarEmbed(pagina)],
        components: [row]
      });
    });

    collector.on('end', () => {
      msg.edit({ components: [] }).catch(() => {});
    });

  }
};