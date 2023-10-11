# App

GymPass style app.

## RFs (Requisitos Funcionais)

- [x] Deve ser possível se cadastrar.
- [x] Deve ser possível se autenticar.
- [x] Deve ser possível obter o perfil de um usuário logado.
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado.
- [x] Deve ser possível o usuário obter seu histórico de check-ins.
- [x] Deve ser possível o usuário buscar academias próximas (até 10 km).
- [x] Deve ser possível o usuário buscar uma academia pelo nome.
- [x] Deve ser possível o usuário realizar check-in em uma adademia.
- [x] Deve ser possível validar o check-in de um usuário.
- [x] Deve ser possível cadastrar uma academia.

## RNs (Regras de negócio)

- [x] O usuário não pode se cadastrar com um email duplicado.
- [x] O usuário não pode fazer 2 check-ins no mesmo dia.
- [x] O usuário não pode fazer check-in se não estiver perto (100 m) da academia.
- [ ] O check-in só pode ser validado até 20 minutos após ser criado.
- [ ] O check-in só pode ser validado por administradores.
- [ ] A academia só pode ser cadastrada por administradores.

## RNFs (Requisitos não funcionais)

- [x] A senha do usuário precisa estar criptografada.
- [x] Os dados da aplicação precisam ser persistidos em um banco de dados PostgreSQL.
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página.
- [ ] O usuário precisa ser indentificado por um JWT (JSON Web Token).