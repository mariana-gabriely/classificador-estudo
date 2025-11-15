"""
backend.py

Backend em Flask que atua como intermediário entre um frontend (HTML/JS)
e uma base Prolog (base.pl). Recebe o semestre do aluno e retorna os
conteúdos que ele pode ver, consultando a regra 'recomendar' definida
em base.pl.

Requisitos:
- Python 3.7+
- Flask
- flask-cors (opcional, mas útil para desenvolvimento frontend)
- SWI-Prolog (comando `swipl` disponível no PATH)
- Arquivo base.pl na mesma pasta

Instalação rápida (pip):
pip install flask flask-cors

Exemplo de uso (frontend -> POST /recommend):
POST /recommend
Content-Type: application/json
{ "semester": 3 }

Resposta (application/json):
{
  "semester": 3,
  "results": [
    {"conteudo": "Logica de Programacao", "nivel": "iniciante"},
    ...
  ]
}
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import shlex
import re
import os

app = Flask(__name__)
CORS(app)  # habilita CORS para facilitar o desenvolvimento front-end

BASE_PL = os.path.join(os.path.dirname(__file__), "base.pl")


def query_prolog_semester(semester: int):
    """
    Consulta o Prolog (base.pl) usando SWI-Prolog e a regra 'recomendar(Semestre, Conteudo, Nivel)'.

    Retorna uma lista de dicionários: [{"conteudo": str, "nivel": str}, ...]
    """
    if not os.path.exists(BASE_PL):
        raise FileNotFoundError(f"Arquivo Prolog não encontrado: {BASE_PL}")

    # Construímos um comando Prolog que:
    #  - seta Sem = <semester>
    #  - findall(Conteudo-Nivel, recomendar(Sem, Conteudo, Nivel), L)
    #  - write(L), halt.
    # Observação: output será algo como:
    # ['Logica de Programacao'-'iniciante','Matematica Discreta'-'iniciante',...]
    prolog_goal = (
        f"Sem={semester},"
        "findall(Conteudo-Nivel, recomendar(Sem, Conteudo, Nivel), L),"
        "write(L),"
        "halt."
    )

    # Executa SWI-Prolog
    cmd = ["swipl", "-s", BASE_PL, "-g", prolog_goal]
    try:
        completed = subprocess.run(
            cmd, capture_output=True, text=True, timeout=8
        )
    except FileNotFoundError as e:
        # swipl não encontrado
        raise EnvironmentError(
            "SWI-Prolog ('swipl') não encontrado no PATH. Instale o SWI-Prolog e garanta que 'swipl' esteja acessível."
        ) from e
    except subprocess.TimeoutExpired as e:
        raise RuntimeError("A consulta ao Prolog excedeu o tempo máximo permitido.") from e

    if completed.returncode != 0:
        # Em caso de erro, retornamos stderr para ajudar debugging
        raise RuntimeError(
            f"Prolog retornou erro (returncode={completed.returncode}): {completed.stderr.strip()}"
        )

    raw = completed.stdout.strip()
    # Se vazio -> sem resultados
    if not raw:
        return []

    # Parse do output Prolog.
    # Saída esperada: [ 'A'-'nivel1','B'-'nivel2', ... ]
    # Vamos extrair pares Conteudo-Nivel com regex.
    # Padronizamos extraindo todas as ocorrências do formato:
    #  '...'-'...'   ou   '...'-nivel   ou   ...-nivel
    pattern = re.compile(
        r"(?:'(?P<conteudo_q>[^']*)'|(?P<conteudo_u>[^'\[\],\-\s][^'\[\],]*?))\s*-\s*(?:'(?P<nivel_q>[^']*)'|(?P<nivel_u>[a-zA-Z0-9_]+))"
    )

    results = []
    for m in pattern.finditer(raw):
        conteudo = m.group("conteudo_q") if m.group("conteudo_q") is not None else m.group("conteudo_u")
        nivel = m.group("nivel_q") if m.group("nivel_q") is not None else m.group("nivel_u")
        if conteudo is None or nivel is None:
            continue
        # limpeza simples
        conteudo = conteudo.strip()
        nivel = nivel.strip()
        results.append({"conteudo": conteudo, "nivel": nivel})

    # Caso o parse não encontre nada, tentamos um fallback mais simples:
    if not results:
        # tenta extrair strings entre aspas simples na ordem Conteudo,Nivel,...
        quoted = re.findall(r"'([^']*)'", raw)
        # esperar pares (conteudo, nivel)
        if quoted and len(quoted) % 2 == 0:
            for i in range(0, len(quoted), 2):
                results.append({"conteudo": quoted[i].strip(), "nivel": quoted[i + 1].strip()})

    return results


@app.route("/", methods=["GET"])
def index():
    return (
        "Backend Prolog -> Flask. Use POST /recommend com JSON {'semester': <int>} "
        "para obter os conteúdos recomendados."
    )


@app.route("/recommend", methods=["POST"])
def recommend():
    """
    Endpoint principal.
    Recebe JSON { "semester": <int> } e retorna os conteúdos que o aluno pode ver.
    """
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "JSON inválido ou não enviado."}), 400

    # aceita chaves 'semester' ou 'semestre' (pt-br)
    semester = data.get("semester", data.get("semestre"))
    if semester is None:
        return jsonify({"error": "O campo 'semester' (ou 'semestre') é obrigatório."}), 400

    # tenta converter para inteiro
    try:
        semester_int = int(semester)
        if semester_int < 1:
            raise ValueError()
    except Exception:
        return jsonify({"error": "O campo 'semester' deve ser um inteiro positivo."}), 400

    try:
        results = query_prolog_semester(semester_int)
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 500
    except EnvironmentError as e:
        return jsonify({"error": str(e)}), 500
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:  
        return jsonify({"error": "Erro interno ao consultar Prolog.", "details": str(e)}), 500

    # Ordena resultados por nível e conteúdo para previsibilidade (iniciante -> intermediario -> avancado)
    nivel_ordem = {"iniciante": 0, "intermediario": 1, "avancado": 2}
    results.sort(key=lambda x: (nivel_ordem.get(x["nivel"].lower(), 99), x["conteudo"].lower()))

    return jsonify({"semester": semester_int, "results": results}), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "prolog_file": os.path.basename(BASE_PL)})


if __name__ == "__main__":
    # Porta padrão 5000. Em produção, use gunicorn/uvicorn por exemplo.
    app.run(host="0.0.0.0", port=5000, debug=True)
