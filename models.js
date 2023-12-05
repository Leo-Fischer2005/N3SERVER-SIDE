// Exemplo simples, ajuste conforme sua necessidade
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Proprietario = sequelize.define('Proprietario', {
  // Defina os campos do Proprietario
});

const Veiculo = sequelize.define('Veiculo', {
  // Defina os campos do Veiculo
});

const TipoVeiculo = sequelize.define('TipoVeiculo', {
  // Defina os campos do TipoVeiculo
});

// Defina as associações entre os modelos, se necessário

module.exports = { sequelize, Proprietario, Veiculo, TipoVeiculo };