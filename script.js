// Aguarda todo o conteúdo HTML ser carregado antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // Referências aos elementos do DOM (HTML)
    const form = document.getElementById('studyForm');
    const semesterInput = document.getElementById('semester');
    const resultsDiv = document.getElementById('results-area');

    // Adiciona um "ouvinte" para o evento de envio do formulário
    form.addEventListener('submit', function(event) {
        // Previne o comportamento padrão do formulário (recarregar a página)
        event.preventDefault();
        
        // Captura o valor digitado pelo usuário
        const semester = semesterInput.value;
        
        // verifica se o campo está vazio ou é inválido
        if (!semester || semester < 1) {
            alert('Digite um semestre válido.');
            return;
        }

        resultsDiv.innerHTML = '<p style="text-align:center">Consultando o Oráculo (Prolog)... ⏳</p>';

        // COMUNICAÇÃO COM O PYTHON
        fetch('http://127.0.0.1:5000/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ semester: semester })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultsDiv.innerHTML = `<p style="color:red">Erro: ${data.error}</p>`;
            } else {
                exibirResultados(semester, data.results);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            resultsDiv.innerHTML = '<p style="color:red">Erro ao conectar com o servidor Python.</p>';
        });
    });
});

function exibirResultados(semestre, lista) {
    const area = document.getElementById('results-area');
    
    if (lista.length === 0) {
        area.innerHTML = '<p>Nenhum conteúdo encontrado.</p>';
        return;
    }

    let html = `<h2 style="text-align:center">Conteúdos para o ${semestre}º Semestre</h2>`;
    
    // agrupar as matérias por nível de dificuldade
    const niveis = { 'iniciante': [], 'intermediario': [], 'avancado': [] };
    
    lista.forEach(item => {
        if (niveis[item.nivel]) {
            niveis[item.nivel].push(item.conteudo);
        }
    });

    for (const [nivel, conteudos] of Object.entries(niveis)) {
        if (conteudos.length > 0) {
            const cor = nivel === 'iniciante' ? '#99f2ad' : (nivel === 'intermediario' ? '#f5d984' : '#fc7481');
            html += `
                <div style="margin-top: 20px; border-left: 5px solid ${cor}; padding-left: 15px;">
                    <h3 style="text-transform: capitalize;">${nivel}</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${conteudos.map(c => `<li style="padding: 10px 10px; border-bottom: 1px solid #eee;"> ${c}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }

    area.innerHTML = html;
}
