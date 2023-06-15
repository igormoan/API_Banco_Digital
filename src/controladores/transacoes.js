let { contas, saques, depositos, transferencias } = require('../bancodedados');
const { format } = require('date-fns');



function depositar(req, res) {
    const { numero_conta, valor } = req.body;




    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta));
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' });
    }


    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'Valor do depósito deve ser maior que zero' });
    }


    contaEncontrada.saldo += valor;


    const registroDaOperacao = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor
    };

    depositos.push(registroDaOperacao);


    return res.status(200).json({ mensagem: 'Depósito realizado com sucesso!' });
}



function sacar(req, res) {
    const { numero_conta, valor, senha } = req.body;




    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta));
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' });
    }


    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({
            mensagem: "Senha inválida para a conta informada"
        });
    }



    if (contaEncontrada.saldo < valor) {
        return res.status(403).json({ mensagem: "Saldo insuficiente para realizar o saque" });
    }


    contaEncontrada.saldo -= valor;


    const registroDaOperacao = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor
    };

    saques.push(registroDaOperacao);

    return res.status(200).json({ mensagem: 'Saque realizado com sucesso!' });
}


function transferir(req, res) {
    const { numero_conta_origem, senha, valor, numero_conta_destino } = req.body;



    const contaOrigem = contas.find(conta => Number(conta.numero) === Number(numero_conta_origem));

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'Conta de origem não encontrada.' });
    }

    if (contaOrigem.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha inválida.' });
    }

    const contaDestino = contas.find(conta => Number(conta.numero) === Number(numero_conta_destino));

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'Conta de destino não encontrada.' });
    }

    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente.' });
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;


    contaOrigem.transferencias.push({
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor
    });

    const registroDaOperacao = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    transferencias.push(registroDaOperacao);

    return res.status(200).json({ mensagem: 'Transferência realizada com sucesso!' });
}



module.exports = {
    depositar,
    sacar,
    transferir,
}
