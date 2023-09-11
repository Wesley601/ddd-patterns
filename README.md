# ddd patterns

Projeto para estudo de DDD e TDD baseado no curso Dev Full Cycle da Code Education.

## ferramentas usadas no projeto

```
typescript - linguagem de programação
tsx        - para executar o typescript diretamente
biome      - lint e formatação de código
knex       - query builder / migrations
vitest     - testes unitários
```

## Observações

Tomei a liberdade de fazer algumas mudanças no projeto original, como por exemplo:

### de ferramental

- usar o knex como query builder, atualmente busco evitar o uso de ORM's, então optei por usar o knex para fazer as queries e migrations. Pra mim com ele consigo estar mais proximo do SQL sem me preocupar com a compatibilidade com o banco de dados.
- usar o vitest para testes unitários. Ele tem a api praticamente igual ao jest e é bem mais performático.
- usar o tsx para executar o typescript diretamente. Ele trás um tempo de execução bem satisfatório para o ambiente de desenvolvimento e não preciso me preocupar em compilar o código antes de executar.
- usar o biome para lint e formatação de código. O objetivo do Biome é centralizar as ferramentas de desenvolvimento do ecossistema javascript/typescript em um único pacote. Na versão atual ele só faz o lint, e a formatação de código o que já me livra de configurar o eslint e o prettier 👌.

### de código

Aqui eu tentei seguir o mais próximo possível do que foi passado no curso, mas algumas coisas eu optei por me aprofundar um pouco melhor.

No meu entendimento, tudo aquilo que fosse relacionado a dinheiro (price e total) presentei como um Objeto de Valor Money, assim consigo ter mais controle sobre como ele é apresentado e calculado. Além disso, criei um objeto de valor para representar o reward de um customer. Ao meu ver, mesmo que simples, o reward me pareceu precisar de algo mais expressivo. Então na classe reward abstrai a regra de increase, mas mantive a base de calculo no customer, não sei foi a melhor decisão então adoraria ouvir feedbacks a respeito 😁.

## comandos

### instalar dependências

```bash
npm install
```

### rodar os testes unitários

```bash
npm t
# ou
npm run test:watch
```

### rodar o projeto

```bash
# Obs no momento o projeto não tem uma interface, então ele só vai rodar e apresentar uma mensagem qualquer no console
npm run start
```
