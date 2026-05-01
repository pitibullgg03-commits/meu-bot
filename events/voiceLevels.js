const fs = require('fs');
const rolesConfig = require('../config/callRoles');

const path = './database/users.json';
const tempoCall = new Map();

// 🔥 GARANTE QUE A PASTA E ARQUIVO EXISTEM
if (!fs.existsSync('./database')) {
  fs.mkdirSync('./database');
}

if (!fs.existsSync(path)) {
  fs.writeFileSync(path, '{}');
}

// =============================
// 📦 FUNÇÕES DE BANCO SEGURAS
// =============================
function getData() {
  try {
    const raw = fs.readFileSync(path);
    return raw.length ? JSON.parse(raw) : {};
  } catch (err) {
    console.log('Erro ao ler database:', err);
    return {};
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log('Erro ao salvar database:', err);
  }
}

module.exports = (client) => {

  // =====================================
  // 🔥 SALVAMENTO AUTOMÁTICO (ANTI PERDA)
  // =====================================
  setInterval(() => {

    const data = getData();

    for (const [userId, entrou] of tempoCall.entries()) {

      const agora = Date.now();
      const tempo = agora - entrou;

      if (!data[userId]) {
        data[userId] = { tempo: 0 };
      }

      data[userId].tempo += tempo;

      tempoCall.set(userId, agora);
    }

    saveData(data);

    console.log('💾 Salvando tempo automaticamente...');

  }, 60000);

  // =====================================
  // 🎧 SISTEMA DE CALL
  // =====================================
  client.on('voiceStateUpdate', async (oldState, newState) => {

    const userId = newState.id;

    // 🔥 ENTROU
    if (!oldState.channelId && newState.channelId) {

      if (newState.channel?.name.toLowerCase().includes('afk')) return;

      tempoCall.set(userId, Date.now());
    }

    // 🔥 SAIU
    if (oldState.channelId && !newState.channelId) {

      const entrou = tempoCall.get(userId);
      if (!entrou) return;

      const tempo = Date.now() - entrou;

      const data = getData();

      if (!data[userId]) {
        data[userId] = { tempo: 0 };
      }

      data[userId].tempo += tempo;
      saveData(data);

      tempoCall.delete(userId);

      const member = oldState.member;
      if (!member) return;

      const horas = data[userId].tempo / 1000 / 60 / 60;

      let cargoFinal = null;
      let nomeCargo = null;

      for (const role of rolesConfig) {
        if (horas >= role.tempo) {
          cargoFinal = role.cargo;
          nomeCargo = role.nome;
        }
      }

      if (!cargoFinal) return;

      if (member.roles.cache.has(cargoFinal)) return;

      try {

        // remove antigos
        for (const role of rolesConfig) {
          if (member.roles.cache.has(role.cargo)) {
            await member.roles.remove(role.cargo);
          }
        }

        // adiciona novo
        await member.roles.add(cargoFinal);

        const canal = oldState.guild.systemChannel;

        if (canal) {
          canal.send(`🎉 ${member} evoluiu para **${nomeCargo}**! 🏆`);
        }

        await member.send(
          `🏆 Você subiu para **${nomeCargo}** na Caverna dos Gamers! 🔥`
        ).catch(() => {});

      } catch (err) {
        console.log('Erro ao atualizar cargo:', err);
      }
    }

  });

};