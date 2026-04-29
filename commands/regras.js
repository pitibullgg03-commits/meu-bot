const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

// 🔒 ID DO CARGO STAFF
const CARGO_STAFF = '1390278164122566736';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('regras')
    .setDescription('Envia o painel de regras do servidor'),

  async execute(interaction) {

    const member = interaction.member;

    // 🔒 Apenas STAFF pode usar
    if (!member.roles.cache.has(CARGO_STAFF)) {
      return interaction.reply({
        content: '❌ Apenas a STAFF pode usar esse comando.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('📜 REGRAS DO SERVIDOR')
      .setColor('#ff0000')

      .setDescription(
`Bem-vindo ao servidor! Para manter um ambiente tranquilo e divertido para todos, siga as regras abaixo:

🔹 **1. Respeito acima de tudo**
Trate todos com respeito. Ofensas, preconceito, racismo, homofobia ou qualquer tipo de discriminação não serão tolerados.

🔹 **2. Sem spam ou flood**
Evite enviar mensagens repetidas, links sem contexto ou poluir os chats.

🔹 **3. Conteúdo proibido**
Não é permitido conteúdo +18, gore, ilegal ou que viole as diretrizes do Discord.

🔹 **4. Sem divulgação sem permissão**
Não divulgue servidores, canais ou links sem autorização da staff.

🔹 **5. Uso correto dos canais**
Cada canal tem um propósito — use-os corretamente (ex: chat de jogo, chat geral, etc).

🔹 **6. Calls organizadas**
Evite gritaria, som alto, música sem permissão ou atrapalhar quem está jogando.

🔹 **7. Nick e foto apropriados**
Evite nomes ou imagens ofensivas ou inapropriadas.

🔹 **8. Sem brigas ou discussões tóxicas**
Discussões são normais, mas sem xingamentos ou treta desnecessária.

🔹 **9. Respeite a staff**
Admins e moderadores estão aqui para manter a ordem. Decisões devem ser respeitadas.

🔹 **10. Divirta-se! 🎮**
O foco do servidor é jogar, conversar e fazer amizade. Mantenha o clima positivo!

⚠️ **Punições:**
O descumprimento das regras pode resultar em aviso, mute, kick ou ban.

✅ Ao permanecer no servidor, você concorda com todas as regras.`
      )

      // 🖼️ BANNER
      .setImage('https://i.postimg.cc/8CYScdPd/Chat-GPT-Image-28-de-abr-de-2026-12-36-40.png')

      // 👤 LOGO
      .setThumbnail('https://i.postimg.cc/D0KR4xV5/Chat-GPT-Image-28-de-abr-de-2026-10-38-43.png')

      .setFooter({ text: '🇧🇷 CAVERNA DOS GAMERS' });

    await interaction.reply({
      embeds: [embed]
    });
  }
};