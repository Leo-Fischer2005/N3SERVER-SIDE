const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// Obtenha a chave secreta da variável de ambiente
const secretKey = process.env.JWT_SECRET || 'sua_chave_secreta_padrão';

// ... Seu código continua aqui ...

// Rota para autenticação e geração de token
app.post('/login', (req, res) => {
  // Este teste abaixo deve ser feito no seu banco de dados
  if ((req.body.user === 'camargo') && (req.body.pwd === '123')) {
    // Auth OK
    const id = 1; // Este id viria do banco de dados
    const token = jwt.sign({ id }, secretKey, {
      expiresIn: 300 // Expires in 5min
    });
    console.log('Token gerado com sucesso:', token);
    return res.json({ auth: true, token: token });
  }
  console.log('Erro ao autenticar usuário:', req.body.user);
  res.status(500).json({ message: 'Login inválido!' });
});