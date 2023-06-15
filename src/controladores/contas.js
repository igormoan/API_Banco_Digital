const { banco, contas, saques, depositos, transferencias } = require('../bancodedados');


function listarContas(req, res) {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: 'Senha do banco é obrigatória' });
    }

    if (senha_banco !== banco.senha) {
        return res.status(400).json({ mensagem: 'A senha do banco informada é inválida!' });
    }

    return res.status(200).json(contas);
}




function criarContaBancaria(req, res) {
    const { nome, cpf, dataDeNascimento, telefone, email, senha } = req.body;


    const camposObrigatorios = [nome, cpf, dataDeNascimento, telefone, email, senha];
    if (!camposObrigatorios.every(Boolean)) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const cpfDaConta = contas.some((conta) => conta.usuario.cpf === cpf)
    if (cpfDaConta) {
        return res.status(400).json({ mensagem: 'O CPF informado já foi cadastrado' });
    }

    const emailDaConta = contas.some((conta) => conta.usuario.email === email)
    if (emailDaConta) {
        return res.status(400).json({ mensagem: 'O email informado já foi cadastrado' });
    }





    const novaConta = {
        numero: (contas.length + 1).toString(),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            dataDeNascimento,
            telefone: telefone.toString(),
            email,
            senha: senha.toString(),
        },

        contas: [],
        saques: [],
        depositos: [],
        transferencias: []
    };


    contas.push(novaConta);

    return res.status(201).json(novaConta);
};


function atualizarUsuarioDaContaBancaria(req, res) {
    const { nome, email, cpf, dataDeNascimento, telefone, senha } = req.body;
    const { numeroConta } = req.params;



    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numeroConta));

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'A conta não existe' });
    }

    if (cpf !== contaEncontrada.usuario.cpf) {

        const existeCpf = contas.find(conta => conta.usuario.cpf === cpf);

        if (existeCpf) {
            return res.status(400).json({ mensagem: 'Esse Cpf já possui cadastro' });

        }
    }

    if (email !== contaEncontrada.usuario.email) {

        const existeEmail = contas.find(conta => conta.usuario.email === email);

        if (existeEmail) {
            return res.status(200).json({ mensagem: 'Conta atualizada com sucesso!' });
        }
    }



    contaEncontrada.usuario = {
        nome,
        email,
        cpf,
        dataDeNascimento,
        telefone,
        senha
    }

    return res.status(200).json({ mensagem: 'Conta atualizada com sucesso!' })

}


function excluirConta(req, res) {
    const numeroConta = req.params.numeroConta;
    const contaEncontrada = contas.findIndex((conta) => Number(conta.numero) === Number(numeroConta));

    if (!contaEncontrada === -1) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    const saldoConta = contas[contaEncontrada];
    if (saldoConta.saldo !== 0) {
        return res.status(400).json({ mensagem: 'Não é possível excluir uma conta com saldo diferente de zero' });
    }

    contas.splice(contaEncontrada, 1);
    return res.status(200).json({ mensagem: 'Conta excluída com sucesso!' });
}




function saldo(req, res) {
    const numero_conta = req.query.numero_conta;
    const senha = req.query.senha;


    if (!numero_conta || !senha) {
        res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios." });
        return;
    }


    const contaEncontrada = contas.find((conta) => Number(conta.numero) === Number(numero_conta));
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada." });

    }


    if (Number(contaEncontrada.usuario.senha) !== Number(senha)) {
        res.status(400).json({ mensagem: "Senha inválida." });
        return;

    }


    res.status(200).json({ saldo: contaEncontrada.saldo });
}


function extrato(req, res) {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'Número da conta e senha são obrigatórios' });
    }

    const contaEncontrada = contas.find(conta => conta.numero === numero_conta);
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha inválida' });
    }





    const visualizacaoDepositos = depositos.filter(deposito => Number(deposito.numero_conta) === Number(numero_conta));

    const visualizacaoSaques = saques.filter(saque => Number(saque.numero_conta) === Number(numero_conta));

    const trasferenciasEnviadas = transferencias.filter(transferencia => Number(transferencia.numero_conta_origem) === Number(numero_conta));

    const trasferenciasRecebidas = transferencias.filter(transferencia => Number(transferencia.numero_conta_destino) === Number(numero_conta));

    return res.json({
        depositos: visualizacaoDepositos,
        saques: visualizacaoSaques,
        trasferenciasEnviadas,
        trasferenciasRecebidas
    });


}



module.exports = {
    listarContas,
    criarContaBancaria,
    atualizarUsuarioDaContaBancaria,
    excluirConta,
    saldo,
    extrato
}

















