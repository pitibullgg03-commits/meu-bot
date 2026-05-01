const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { STAFF_ROLE } = require('../config/modConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('callpainel')
    .setDescription('Painel do sistema de tempo em call'),

  async execute(interaction) {

    // 🔒 Apenas staff
    if (!interaction.member.roles.cache.has(STAFF_ROLE)) {
      return interaction.reply({
        content: '❌ Você não tem permissão.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🪨 SISTEMA DE PROGRESSÃO • CAVERNA DOS GAMERS')
      .setColor('#ff0000')
      .setThumbnail('https://i.postimg.cc/CxpXNMQd/Chat-GPT-Image-29-de-abr-de-2026-10-07-31.png')
      .setImage('https://i.postimg.cc/7Z41Db50/Chat-GPT-Image-1-de-mai-de-2026-13-17-57.png')

      .setDescription(
        `🎮 **Evolua dentro da caverna!**\n\n` +
        `Fique em chamadas de voz para subir de nível e desbloquear cargos exclusivos.\n\n` +
        `🔥 Quanto mais tempo em call, mais respeito, vantagens e destaque você conquista.`
      )

      .addFields(

        {
          name: '⏱️ Como funciona?',
          value:
            `• Entre em uma call\n` +
            `• O tempo começa automaticamente\n` +
            `• Ao sair, ele é salvo\n` +
            `• Ao atingir metas, você evolui 🎖️`,
          inline: false
        },

        {
          name: '🏆 Ranking Global',
          value:
            `• Dispute o TOP 1 do servidor 🥇\n` +
            `• Mostre quem domina a caverna\n`,
          inline: false
        },

        // ===== CARGOS =====

        {
          name: '⛏️ Minerador',
          value:
            `⏱️ 5 horas\n\n` +
            `• Criar calls temporárias\n` +
            `• Enviar links\n` +
            `• Emojis externos\n`,
          inline: true
        },

        {
          name: '🔥 Explorador',
          value:
            `⏱️ 10 horas\n\n` +
            `• Prioridade em eventos\n` +
            `• Comandos especiais\n` +
            `• Chat exclusivo\n`,
          inline: true
        },

        {
          name: '💎 Caçador de Relíquias',
          value:
            `⏱️ 20 horas\n\n` +
            `• Criar salas privadas\n` +
            `• Comandos VIP\n` +
            `• Sorteios exclusivos\n`,
          inline: false
        },

        {
          name: '🐉 Guardião da Caverna',
          value:
            `⏱️ 40 horas\n\n` +
            `• Destacar mensagens\n` +
            `• Pingar cargos\n` +
            `• Área premium\n`,
          inline: false
        },

        // ===== COMANDOS =====

        {
          name: '📊 Comandos',
          value:
            `🔹 \`/meutempo\` → Ver seu progresso\n` +
            `🔹 \`/topcall\` → Ranking global\n`,
          inline: false
        },

        {
          name: '🎖️ Sistema automático',
          value:
            `• Promoção automática\n` +
            `• Remove cargo antigo\n` +
            `• Aviso no chat + DM 🔔`,
          inline: false
        },

        {
          name: '⚠️ Regras do sistema',
          value:
            `• AFK pode não contar tempo\n` +
            `• Abuso pode gerar punição\n`,
          inline: false
        }
      )

      .setFooter({
        text: '🔥 CAVERNA DOS GAMERS • Evolua ou fique para trás'
      });

    await interaction.reply({
      embeds: [embed]
    });
  }
};