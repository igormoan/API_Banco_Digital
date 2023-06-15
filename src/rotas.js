const express = require('express');
const contas = require('./controladores/contas');
const transacoes = require('./controladores/transacoes');
const intermediario = require('./intermediario/index')
const rotas = express();




rotas.get('/contas', contas.listarContas);
rotas.post('/contas', contas.criarContaBancaria);
rotas.put('/contas/:numeroConta/usuario', intermediario.vericarAtualizacaoUsuario, contas.atualizarUsuarioDaContaBancaria);
rotas.delete('/contas/:numeroConta', contas.excluirConta);
rotas.get('/contas/saldo', contas.saldo);
rotas.get('/contas/extrato', contas.extrato);



rotas.post('/transacoes/depositar',
    intermediario.verificarConta,
    intermediario.verificarValor,
    transacoes.depositar);


rotas.post('/transacoes/sacar',
    intermediario.verificarConta,
    intermediario.verificarValor,
    intermediario.verificarSenha,
    transacoes.sacar);

rotas.post('/transacoes/transferir',

    intermediario.verificarSenha,
    intermediario.verificarValor,
    intermediario.verificarTransferencia,
    transacoes.transferir);






module.exports = rotas;