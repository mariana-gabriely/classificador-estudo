# Classificador de Planos de Estudo

Este projeto foi desenvolvido para a disciplina de Paradigmas de Programação. O objetivo é criar uma aplicação que integre três paradigmas diferentes para resolver um problema:

1. Web (Frontend): Interface com o usuário.
2. Imperativo (Python/Flask): Controle de fluxo e API.
3. Lógico (Prolog): Base de conhecimento e regras de inferência.

## Requisitos do Sistema

Para executar este projeto, você deve ter os seguintes softwares instalados:

### 1. Python (3.7 ou superior)
Linguagem utilizada para o backend.
- **Download:** https://www.python.org/downloads/
- **Nota:** Durante a instalação, marque a opção "Add Python to PATH".

### 2. SWI-Prolog
Interpretador necessário para processar a lógica do sistema.
- **Download:** https://www.swi-prolog.org/download/stable
- **Versão recomendada:** Microsoft Windows 64-bit.

## Configuração Importante (PATH do Prolog)

Para que o Python consiga "conversar" com o Prolog, o comando `swipl` deve estar acessível pelo terminal.

**Opção A: Durante a Instalação (Recomendado)**
Ao instalar o SWI-Prolog, o instalador perguntará se deseja adicionar ao PATH. Marque a opção:
"Add swipl to the system PATH for all users".

**Opção B: Configuração Manual (Caso já tenha instalado)**
Se você executar o projeto e receber o erro "swipl não encontrado", siga estes passos no Windows:

1. Pesquise no Windows por "Editar as variáveis de ambiente do sistema".
2. Clique no botão "Variáveis de Ambiente".
3. Na lista "Variáveis do sistema" (parte inferior), procure pela variável chamada "Path" e clique em "Editar".
4. Clique em "Novo" e cole o caminho da pasta bin do Prolog. Geralmente é:
   C:\Program Files\swipl\bin
5. Clique em OK em todas as janelas.
6. Reinicie o seu terminal (ou o VS Code) para aplicar as mudanças.

## Instalação das Dependências

Antes de rodar o projeto, é necessário instalar as bibliotecas do Flask. Abra o terminal na pasta do projeto e execute:

pip install flask flask-cors

## Como Executar o Projeto

Siga a ordem abaixo para garantir o funcionamento correto:

### Passo 1: Iniciar o Servidor Backend
No terminal, dentro da pasta do projeto, execute:

python backend.py

Se tudo estiver correto, você verá uma mensagem informando que o servidor está rodando em: http://127.0.0.1:5000.
Mantenha este terminal aberto.

### Passo 2: Abrir a Interface
Vá até a pasta do projeto e dê um duplo clique no arquivo index.html ou utilize a extensão Live Server no VS Code. O navegador abrirá a aplicação.

### Passo 3: Utilizar
1. Digite o número do semestre no formulário (ex: 3).
2. Clique em "Consultar" ou pressione Enter no teclado.
3. O sistema exibirá a lista de matérias permitidas para aquele semestre.

## Estrutura dos Arquivos

- index.html: Estrutura da página web.
- style.css: Definições de estilo e layout.
- script.js: Captura o evento do formulário e faz a requisição ao backend.
- backend.py: Servidor Flask que recebe a requisição, chama o subprocesso do Prolog e devolve a resposta.
- base.pl: Arquivo contendo os fatos (conteúdos) e as regras lógicas (quem pode ver o quê).
