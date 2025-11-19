// script.js - Versão completa sem backend
// Funciona 100% no frontend com dados locais

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Recomendação carregado!');
    
    // Encontrar o formulário existente
    const form = document.querySelector('form');
    const semesterInput = document.getElementById('semester');
    
    // Remover o action do formulário para evitar recarregamento da página
    form.removeAttribute('action');
    form.removeAttribute('method');
    
    // Adicionar nosso próprio manipulador de submit
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio tradicional do formulário
        
        const semester = semesterInput.value.trim();
        
        if (!semester || semester < 1) {
            alert('Por favor, informe um semestre válido (número positivo).');
            return;
        }

        // Gerar recomendações localmente
        const results = gerarRecomendacoes(parseInt(semester));
        exibirResultadosFormatados(parseInt(semester), results);
    });
});

// Dados baseados no seu arquivo base.pl
function obterConteudos() {
    return {
        'iniciante': [
            'Logica de Programacao',
            'Matematica Discreta', 
            'Arquitetura de Software',
            'Design de Sistemas',
            'Projeto Interdisciplinar',
            'Modelagem De Processos',
            'Gerenciamento de Requisitos',
            'Analise de Algoritmos'
        ],
        'intermediario': [
            'Estrutura de Dados',
            'Banco de Dados 1',
            'Programacao Orientada a Objetos',
            'Sistemas Operacionais',
            'Estatistica',
            'Algebra Linear',
            'Microcontroladores',
            'Paradigmas de Programacao'
        ],
        'avancado': [
            'Inteligencia Artificial',
            'Redes de Computadores',
            'Compiladores',
            'Seguranca da Informacao',
            'Sistemas Distribuidos',
            'Banco de Dados 2',
            'Calculo',
            'Desenvolvimento de Jogos'
        ]
    };
}

// Simula as regras do Prolog
function gerarRecomendacoes(semestre) {
    const conteudos = obterConteudos();
    const resultados = [];
    
    // Regra: Semestre 1+ pode ver iniciante
    if (semestre >= 1) {
        conteudos.iniciante.forEach(conteudo => {
            resultados.push({
                conteudo: conteudo,
                nivel: 'iniciante'
            });
        });
    }
    
    // Regra: Semestre 3+ pode ver intermediário
    if (semestre >= 3) {
        conteudos.intermediario.forEach(conteudo => {
            resultados.push({
                conteudo: conteudo,
                nivel: 'intermediario'
            });
        });
    }
    
    // Regra: Semestre 5+ pode ver avançado
    if (semestre >= 5) {
        conteudos.avancado.forEach(conteudo => {
            resultados.push({
                conteudo: conteudo,
                nivel: 'avancado'
            });
        });
    }
    
    return resultados;
}

function exibirResultadosFormatados(semestre, resultados) {
    // Criar container para resultados
    const containerExistente = document.querySelector('.container');
    let resultadosDiv = document.getElementById('resultados-formatados');
    
    // Se já existe, remover para atualizar
    if (resultadosDiv) {
        resultadosDiv.remove();
    }
    
    // Criar novo container de resultados
    resultadosDiv = document.createElement('div');
    resultadosDiv.id = 'resultados-formatados';
    resultadosDiv.style.cssText = `
        max-width: 800px;
        margin: 30px auto;
        padding: 25px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: Arial, sans-serif;
    `;
    
    // Adicionar após o container principal
    containerExistente.parentNode.insertBefore(resultadosDiv, containerExistente.nextSibling);
    
    if (!resultados || resultados.length === 0) {
        resultadosDiv.innerHTML = `
            <h2 style="color: #222; text-align: center; margin-bottom: 20px;">
                📚 Resultados para o ${semestre}º Semestre
            </h2>
            <p style="text-align: center; color: #666; font-style: italic; padding: 20px;">
                Nenhum conteúdo encontrado para este semestre.
            </p>
        `;
        return;
    }
    
    // Agrupar por nível
    const porNivel = {
        'iniciante': [],
        'intermediario': [],
        'avancado': []
    };
    
    resultados.forEach(item => {
        porNivel[item.nivel].push(item.conteudo);
    });
    
    // Construir HTML
    let html = `
        <h2 style="color: #222; text-align: center; margin-bottom: 25px; padding-bottom: 10px; border-bottom: 2px solid #0058d1;">
            📚 Conteúdos Recomendados - ${semestre}º Semestre
        </h2>
    `;
    
    // Ordem de exibição
    const ordemNiveis = ['iniciante', 'intermediario', 'avancado'];
    
    ordemNiveis.forEach(nivel => {
        if (porNivel[nivel].length > 0) {
            const tituloNivel = nivel.charAt(0).toUpperCase() + nivel.slice(1);
            
            html += `
                <div style="margin-bottom: 30px;">
                    <div style="font-size: 20px; font-weight: bold; color: #0058d1; margin-bottom: 15px; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #0058d1;">
                        🎯 Nível ${tituloNivel}
                    </div>
            `;
            
            porNivel[nivel].forEach(conteudo => {
                html += `
                    <div style="padding: 12px 15px; margin: 8px 0; background: white; border-radius: 6px; border: 1px solid #e0e0e0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; align-items: center;">
                        <span style="color: #28a745; margin-right: 10px;">✅</span>
                        <span style="font-size: 16px;">${conteudo}</span>
                    </div>
                `;
            });
            
            html += `</div>`;
        }
    });
    
    // Estatísticas
    const total = resultados.length;
    html += `
        <div style="text-align: center; margin-top: 25px; padding: 15px; background: #e8f4fd; border-radius: 8px; color: #0056b3;">
            <strong>Total de ${total} conteúdos recomendados</strong>
        </div>
    `;
    
    resultadosDiv.innerHTML = html;
    
    // Rolagem suave para os resultados
    resultadosDiv.scrollIntoView({ behavior: 'smooth' });
}

// Função para capitalizar texto
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}