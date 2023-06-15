function vericarAtualizacaoUsuario(req, res, next) {
    const { nome, email, cpf, dataDeNascimento, telefone, senha } = req.body;



    if (!nome || !email || !cpf || !dataDeNascimento || !telefone || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
    }

    next();
}





function verificarConta(req, res, next) {
    const { numero_conta } = req.body;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'Número da conta é obrigatórios' });
    }

    next();

}

function verificarSenha(req, res, next) {
    const { senha } = req.body;


    if (!senha) {
        return res.status(400).json({ mensagem: "senha é obrigatório" });
    }

    next();
}



function verificarValor(req, res, next) {
    const { valor } = req.body;


    if (!valor) {
        return res.status(400).json({ mensagem: "valor do saque é obrigatório" });
    }

    next();
}


function verificarTransferencia(req, res, next) {
    const { numero_conta_origem, numero_conta_destino } = req.body;

    if (!numero_conta_origem || !numero_conta_destino) {
        return res.status(400).json({ mensagem: 'Campo conta origem e conta destino são obrigatórios.' });
    }

    next();
}



module.exports = { vericarAtualizacaoUsuario, verificarConta, verificarValor, verificarSenha, verificarTransferencia }