<h1 align="center">API - Banco Digital</h1>


Criação de API para um Banco Digital. Sendo um projeto **piloto**, ou seja, no futuro outras funcionalidades podem ser implementadas.

No projeto em questão, envolve à construção de uma RESTful API que permita:

-   Criar conta bancária
-   Atualizar os dados do usuário da conta bancária
-   Depósitar em uma conta bancária
-   Sacar de uma conta bancária
-   Transferir valores entre contas bancárias
-   Consultar saldo da conta bancária
-   Emitir extrato bancário
-   Excluir uma conta bancária

## Requisitos existentes:

-   API segue o padrão REST
-   O código preza pela organização, delimitando as responsabilidades de cada arquivo. 

## Persistências dos dados

Os dados são persistidos em memória, no objeto existente dentro do arquivo `bancodedados.js`. Todas as transações e contas bancárias são inseridas dentro deste objeto.

### Estrutura do objeto no arquivo `bancodedados.js`

```javascript
{
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        // array de contas bancárias
    ],
    saques: [
        // array de saques
    ],
    depositos: [
        // array de depósitos
    ],
    transferencias: [
        // array de transferências
    ],
}
```

## Status Code

Abaixo, é listado os possíveis `status code` esperados como resposta da API.

```javascript
// 200 = requisição bem sucedida
// 201 = requisição bem sucedida e algo foi criado
// 400 = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 404 = o servidor não pode encontrar o recurso solicitado
```

## Endpoints


### Listar contas bancárias

#### `GET` `/contas?senha_banco=123`

Esse endpoint lista todas as contas bancárias existentes.

    -   Verifica se a senha do banco foi informada (passado como query params na url)
    -   Valida se a senha do banco está correta

-   Entrada (query params)

    -   Senha do banco

-   Saída
    -   listagem de todas as contas bancárias existentes



### Criação de conta bancária

#### `POST` `/contas`

Esse endpoint cria uma conta bancária, onde será gerado um número único para identificação da conta (número da conta).

    -   Cria uma nova conta cujo número é único
    -   CPF é um campo único.
    -   E-mail com campo único.
    -   Verifica se todos os campos foram informados (todos são obrigatórios)
    -   Definido o saldo inicial da conta como 0





## Atualizando usuário da conta bancária

#### `PUT` `/contas/:numeroConta/usuario`


    -   Verifica se foi passado, ao menos, um campo no body da requisição
    -   Verifica se o numero da conta passado como parametro na URL é válida
    -   Se o CPF for informado, verifica se já existe outro registro com o mesmo CPF
    -   Se o E-mail for informado, verifica se já existe outro registro com o mesmo E-mail
    -   Atualiza um ou mais campos dos dados do usuário de uma conta bancária


### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

Esse endpoint exclui uma conta bancária existente.

    -   Verifica se o numero da conta passado como parametro na URL é válida
    -   Permiti excluir uma conta bancária apenas se o saldo for 0 (zero)
    -   Remove a conta do objeto de persistência de dados.




### Depositar

#### `POST` `/transacoes/depositar`

Esse endpoint soma o valor do depósito ao saldo de uma conta válida e registra essa transação.

    -   Verifica se o numero da conta e o valor do deposito foram informados no body
    -   Verifica se a conta bancária informada existe
    -   Não permite depósitos com valores negativos ou zerados
    -   Soma o valor de depósito ao saldo da conta encontrada





### Sacar

#### `POST` `/transacoes/sacar`

Esse endpoint realiza o saque de um valor em uma determinada conta bancária e registra essa transação.


    -   Verifica se o numero da conta, o valor do saque e a senha foram informados no body
    -   Verifica se a conta bancária informada existe
    -   Verifica se a senha informada é uma senha válida para a conta informada
    -   Verifica se há saldo disponível para saque
    -   Subtrai o valor sacado do saldo da conta encontrada



### Tranferir

#### `POST` `/transacoes/transferir`

Esse endpoint permite a transferência de recursos (dinheiro) de uma conta bancária para outra e registra essa transação.



    -   Verifica se o número da conta de origem, de destino, senha da conta de origem e valor da transferência foram informados no body
    -   Verifica se a conta bancária de origem informada existe
    -   Verifica se a conta bancária de destino informada existe
    -   Verifica se a senha informada é uma senha válida para a conta de origem informada
    -   Verifica se há saldo disponível na conta de origem para a transferência
    -   Subtrai o valor da transfência do saldo na conta de origem
    -   Soma o valor da transferência no saldo da conta de destino



### Saldo

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Esse endpoint retorna o saldo de uma conta bancária.


    -   Verifica se o numero da conta e a senha foram informadas (passado como query params na url)
    -   Verifica se a conta bancária informada existe
    -   Verifica se a senha informada é uma senha válida
    -   Exibe o saldo da conta bancária em questão


  
### Extrato

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

Esse endpoint lista as transações realizadas de uma conta específica.



    -   Verifica se o numero da conta e a senha foram informadas (passado como query params na url)
    -   Verifica se a conta bancária informada existe
    -   Verifica se a senha informada é uma senha válida
    -   Retorna a lista de transferências, depósitos e saques da conta em questão.





