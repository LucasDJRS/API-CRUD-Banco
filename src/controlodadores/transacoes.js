const { json } = require('express');
let { contas } = require('../bancodedados');
const { format } = require('date-fns');
let transacoes = [];


const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontada!' });
    }

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: "Não é possível depositar esse valor" });
    }

    conta.saldo += valor;

    const data = new Date();
    const dataFormatada = format(data, "yyyy-MM-dd HH:mm:ss");

    const deposito = {
        dataFormatada,
        numero_conta,
        valor,
        tipo: 'deposito'
    };

    transacoes.push(deposito);

    res.status(204).end();
};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontada!' });
    }

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "O número da conta, o valor e a senha correta são obrigatórios!" });
    }

    if (senha !== conta.senha) {
        return res.status(400).json({ mensagem: "Senha inválida!" });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "Não é possível sacar esse valor" });
    }

    if (conta.saldo < valor) {
        return res.status(400).json({ mensagem: "Você não possui saldo para sacar esse valor!" });
    } else {
        conta.saldo -= valor;
    }

    const data = new Date();
    const dataFormatada = format(data, "yyyy-MM-dd HH:mm:ss");

    const saque = {
        dataFormatada,
        numero_conta,
        valor: valor,
        tipo: 'saque'
    };

    transacoes.push(saque);

    res.status(204).end();
};


const transferencia = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    const contaOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem);
    });
    const contaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino);
    });

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'Conta bancária de origem não encontada!' });
    }

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'Conta bancária de destino não encontada!' });
    }

    if (senha !== contaOrigem.senha) {
        return res.status(401).json({ mensagem: "Senha inválida!" });
    }

    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" });
    } else {
        contaOrigem.saldo -= valor;
        contaDestino.saldo += valor;

    }




    const data = new Date();
    const dataFormatada = format(data, "yyyy-MM-dd HH:mm:ss");

    const transacao = {
        dataFormatada,
        numero_conta_origem,
        numero_conta_destino,
        valor,

    };

    transacoes.push(transacao);

    res.status(204).end();
};




const consultarSaldo = (req, res) => {
    const numero_conta = req.query.numero_conta;
    const senha = req.query.senha;
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontada!' });
    }

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O numero da conta e a senha precisam ser informados!" });
    }

    if (senha !== conta.senha) {
        return res.status(400).json({ mensagem: "Senha inválida!" });
    }

    res.status(201).json({ saldo: conta.saldo });
};

const extrato = (req, res) => {
    const numero_conta = req.query.numero_conta;
    const senha = req.query.senha;
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontada!' });
    }

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O numero da conta e a senha precisam ser informados!" });
    }

    if (senha !== conta.senha) {
        return res.status(400).json({ mensagem: "Senha inválida!" });
    }

    const extratoDaConta = {
        depositos: [],
        saques: [],
        transferenciasEnviadas: [],
        transferenciasRecebidas: [],
    };

    transacoes.forEach((transacao) => {
        if (transacao.numero_conta === numero_conta) {
            if (transacao.tipo === 'deposito') {
                extratoDaConta.depositos.push(transacao);
            } else if (transacao.tipo === 'saque') {
                extratoDaConta.saques.push(transacao);
            }
        } else if (transacao.numero_conta_origem === numero_conta) {
            extratoDaConta.transferenciasEnviadas.push(transacao);
        } else if (transacao.numero_conta_destino === numero_conta) {
            extratoDaConta.transferenciasRecebidas.push(transacao);
        }
    });

    res.status(200).json(extratoDaConta);

};

module.exports = {
    depositar,
    sacar,
    transferencia,
    consultarSaldo,
    extrato
};