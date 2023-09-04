const autenticacao = (req, res, next) => {
    const senha = req.query.senha_banco;
    if (!senha) {
        res.status(401).json({ mensagem: 'Informe a senha.' });
    }
    if (senha === 'Cubos123Bank') {
        next();
    } else {
        res.status(401).json({ mensagem: 'A senha do banco informada é inválida!.' });
    }
};

module.exports = { autenticacao };