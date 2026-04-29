const embed = new EmbedBuilder()
  .setTitle('🎫 SISTEMA DE TICKETS')
  .setDescription(
    'Escolha uma opção:\n\n' +
    '🛠️ Suporte\n' +
    '❓ Dúvidas\n' +
    '🚨 Denúncias'
  )
  .setColor('#ff0000')

  // 🖼️ BANNER (IMAGEM PRINCIPAL DO PAINEL)
  .setImage('https://i.postimg.cc/8CYScdPd/Chat-GPT-Image-28-de-abr-de-2026-12-36-40.png')

  // 👤 MINI LOGO (OPCIONAL)
  .setThumbnail('https://i.postimg.cc/D0KR4xV5/Chat-GPT-Image-28-de-abr-de-2026-10-38-43.png')

  .setFooter({ text: '🇧🇷 CAVERNA DOS GAMERS - SISTEMA DE TICKETS' });