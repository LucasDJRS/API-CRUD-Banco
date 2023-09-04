const { json } = require('express');
let { contas } = require('../bancodedados');

const obterContas = () => {
    return contas;
};
const listarContas = (req, res) => {
    const contasBancarias = obterContas();
    res.status(200).json(contasBancarias);
};

let prxId = 1;
const adicionarConta = (conta) => {
    conta.numero = prxId++;
    contas.push(conta);
};
const adicionarContaNoBanco = (req, res) => {
    const conta = req.body;

    if (!conta.nome || !conta.cpf || !conta.data_nascimento || !conta.telefone || !conta.email || !conta.senha) {
        res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
        return;
    }

    if (contas.some((c) => c.cpf === conta.cpf || c.email === conta.email)) {
        res.status(404).json({ mensagem: "Já existe uma conta com o CPF ou e-mail informado." });
        return;
    }

    conta.saldo = 0;

    adicionarConta(conta);

    res.status(204).end();
};

const alterarDadoConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });


    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
        return;
    }

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontada!' });
    }

    if (contas.some((c) => c.cpf === cpf && c.numero !== conta.numero)) {
        res.status(400).json({ mensagem: "O CPF informado já existe cadastrado!" });
        return;
    }

    if (contas.some((c) => c.email === email && c.numero !== conta.numero)) {
        res.status(400).json({ mensagem: "O email informado já existe cadastrado!" });
        return;
    }

    conta.nome = nome;
    conta.cpf = cpf;
    conta.data_nascimento = data_nascimento;
    conta.telefone = telefone;
    conta.email = email;
    conta.senha = senha;

    return res.status(204).end();
};

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;
    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontada!' });
    }

    if (conta.saldo === 0) {
        contas = contas.filter((conta) => {
            return conta.numero !== Number(numeroConta);
        });
    } else {
        res.status(404).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
    }
    return res.status(204).end();
};

module.exports = {
    listarContas,
    adicionarContaNoBanco,
    alterarDadoConta,
    excluirConta

}