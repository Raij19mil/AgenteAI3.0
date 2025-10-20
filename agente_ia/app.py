import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)



# Configurações iniciais
# A chave da API será carregada do .env ou definida via interface
# Para este exemplo, usaremos uma variável de ambiente padrão
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Histórico de conversas para manter o contexto
# Em um ambiente de produção, isso seria armazenado em um banco de dados ou cache
conversation_history = {}

@app.route('/chat', methods=['POST'])
def chat():
    global OPENAI_API_KEY

    data = request.json
    user_message = data.get('message')
    user_id = data.get('user_id', 'default_user') # Identificador para gerenciar contexto por usuário
    agent_prompt = data.get('agent_prompt', 'Você é um assistente de IA útil.')
    api_key = data.get('api_key', OPENAI_API_KEY) # Permite sobrescrever a chave da API

    if not user_message:
        return jsonify({'error': 'Mensagem não fornecida'}), 400

    if not api_key:
        return jsonify({'error': 'Chave da API não configurada. Por favor, forneça uma chave da API.'}), 400

    client = OpenAI(api_key=api_key)

    # Inicializa o histórico para o usuário se não existir
    if user_id not in conversation_history:
        conversation_history[user_id] = [{'role': 'system', 'content': agent_prompt}]

    # Adiciona a mensagem do usuário ao histórico
    conversation_history[user_id].append({'role': 'user', 'content': user_message})

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini", # Modelo padrão, pode ser configurável
            messages=conversation_history[user_id]
        )
        agent_response = response.choices[0].message.content

        # Adiciona a resposta do agente ao histórico
        conversation_history[user_id].append({'role': 'assistant', 'content': agent_response})

        return jsonify({'response': agent_response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/config', methods=['POST'])
def config():
    global OPENAI_API_KEY
    data = request.json
    new_api_key = data.get('api_key')
    new_agent_prompt = data.get('agent_prompt')
    user_id = data.get('user_id', 'default_user')

    if new_api_key:
        OPENAI_API_KEY = new_api_key
        # Opcional: Salvar em .env ou banco de dados para persistência

    if new_agent_prompt:
        # Atualiza o prompt do sistema para o usuário específico
        if user_id in conversation_history:
            conversation_history[user_id][0]['content'] = new_agent_prompt
        else:
            conversation_history[user_id] = [{'role': 'system', 'content': new_agent_prompt}]

    return jsonify({"status": "Configuração atualizada com sucesso."})


@app.route('/reset_context', methods=['POST'])
def reset_context():
    user_id = request.json.get('user_id', 'default_user')
    if user_id in conversation_history:
        del conversation_history[user_id]
    return jsonify({"status": "Contexto resetado com sucesso."})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

