% fatos

conteudo('Logica de Programacao', iniciante).
conteudo('Matematica Discreta', iniciante).
conteudo('Arquitetura de Software', iniciante).
conteudo('Design de Sistemas', iniciante).
conteudo('Projeto Interdisciplinar', iniciante).
conteudo('Modelagem De Processos', iniciante).
conteudo('Gerenciamento de Requisitos', iniciante).
conteudo('Analise de Algoritmos', iniciante).

conteudo('Estrutura de Dados', intermediario).
conteudo('Banco de Dados 1', intermediario).
conteudo('Programacao Orientada a Objetos', intermediario).
conteudo('Sistemas Operacionais', intermediario).
conteudo('Estatistica', intermediario).
conteudo('Algebra Linear', intermediario).
conteudo('Microcontroladores', intermediario).
conteudo('Paradigmas de Programacao', intermediario).

conteudo('Inteligencia Artificial', avancado).
conteudo('Redes de Computadores', avancado).
conteudo('Compiladores', avancado).
conteudo('Seguranca da Informacao', avancado).
conteudo('Sistemas Distribuidos', avancado).
conteudo('Banco de Dados 2', avancado).
conteudo('Calculo', avancado).
conteudo('Desenvolvimento de Jogos ', avancado).

% regras

% Alunos de qualquer semestre podem ver conteúdo iniciante
pode_ver_nivel(Semestre, 'iniciante') :-
    Semestre >= 1.

% Alunos a partir do terceiro semestre podem ver conteúdo intermediario
pode_ver_nivel(Semestre, 'intermediario') :-
    Semestre >= 3.

% Alunos a partir do quinto semestre podem ver conteúdo avancado
pode_ver_nivel(Semestre, 'avancado') :-
    Semestre >= 5.

recomendar(Semestre, Conteudo, Nivel) :-
    conteudo(Conteudo, Nivel),
    pode_ver_nivel(Semestre, Nivel).