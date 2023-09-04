const express = require('express');
const { listarContas, adicionarContaNoBanco, alterarDadoConta, excluirConta } = require('./controlodadores/funcoes');
const { depositar, sacar, transferencia, consultarSaldo, extrato } = require('./controlodadores/transacoes');



const rotas = express();

rotas.get('/contas', listarContas);
rotas.post('/contas', adicionarContaNoBanco);
rotas.put('/contas/:numeroConta/usuario', alterarDadoConta);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferencia);
rotas.get('/saldo', consultarSaldo);
rotas.get('/extrato', extrato);



module.exports = rotas;