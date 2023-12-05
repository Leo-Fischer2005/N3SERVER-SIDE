// index.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { sequelize, Proprietario, Veiculo, TipoVeiculo } = require('./models'); // Importe seus modelos e configure o Sequelize

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: "Servidor base '/' funcionando" });
});

// Rota para autenticação e geração de token
app.post('/login', (req, res, next) => {
    // este teste abaixo deve ser feito no seu banco de dados
    if ((req.body.user === 'camargo') && (req.body.pwd === '123')) {
      // auth ok
      const id = 1; // este id viria do banco de dados
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 900
      });
      console.log('Token gerado com sucesso:', token); // Adicione esta linha
      return res.json({ auth: true, token: token });
    }
    console.log('Erro ao autenticar usuário:', req.body.user); // Adicione esta linha
    res.status(500).json({ message: 'Login inválido!' });
  });

// Rota para criar um Proprietario
app.post('/prop', verifyJWT, (req, res) => {
    const { cpf, nome, fone } = req.body;
  
    const sql = 'INSERT INTO proprietario (cpf, nome, fone) VALUES (?, ?, ?)';
    db.query(sql, [cpf, nome, fone], (err, result) => {
      if (err) {
        console.error('Erro ao criar proprietário:', err);
        res.status(500).json({ message: 'Erro ao criar proprietário', error: err });
      } else {
        res.status(201).json({ message: 'Proprietário criado com sucesso', id: result.insertId });
      }
    });
  });

  // Rota para obter todos os Proprietarios
  app.get('/prop', (req, res) => {
    const sql = 'SELECT * FROM proprietario';
    db.query(sql, (err, results) => {
      if (err) {
        res.status(500).json({ message: 'Erro ao buscar proprietários', error: err });
      } else {
        res.json({ proprietarios: results });
      }
    });
  });
  
  // Rota para obter um Proprietario por ID
  app.get('/prop/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM proprietario WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        res.status(500).json({ message: 'Erro ao buscar proprietário', error: err });
      } else if (results.length === 0) {
        res.status(404).json({ message: 'Proprietário não encontrado' });
      } else {
        res.json({ proprietario: results[0] });
      }
    });
  });
  
  // Rota para atualizar um Proprietario por ID
  app.put('/prop/:id', (req, res) => {
    const { id } = req.params;
    const { cpf, nome, fone } = req.body;
  
    const sql = 'UPDATE proprietario SET cpf = ?, nome = ?, fone = ? WHERE id = ?';
    db.query(sql, [cpf, nome, fone, id], (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Erro ao atualizar proprietário', error: err });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Proprietário não encontrado' });
      } else {
        res.json({ message: 'Proprietário atualizado com sucesso' });
      }
    });
  });
  
  // Rota para deletar um Proprietario por ID
  app.delete('/prop/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM proprietario WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Erro ao deletar proprietário', error: err });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Proprietário não encontrado' });
      } else {
        res.json({ message: 'Proprietário deletado com sucesso' });
      }
    });
  });

// Endpoint protegido com JWT
app.get('/veiculos-proprietario', verifyJWT, async (req, res) => {
  try {
    const veiculos = await Veiculo.findAll({
      where: { proprietarioId: req.userId },
      include: [{ model: TipoVeiculo }]
    });
    res.json({ veiculos });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar veículos do proprietário', error });
  }
});

// ...

function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'Não há token' });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Erro com a Autenticação do Token' });

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor em execução na porta ${PORT}...`);
  });
});
