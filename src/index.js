const express = require('express');
const rotas = require('./roteadores');
const intermediarios = require('./intermediario');
const app = express();

app.use(express.json());
app.use('/contas', intermediarios.autenticacao)
app.use(rotas);

app.listen(3000);