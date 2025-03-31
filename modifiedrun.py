import collections.abc
collections.Iterable = collections.abc.Iterable  # Compatibility fix
from agno.agent import Agent, AgentMemory
from agno.models.groq import Groq  
from agno.embedder.google import GeminiEmbedder
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.knowledge.json import JSONKnowledgeBase
from agno.vectordb.lancedb import LanceDb, SearchType
from agno.memory.classifier import MemoryClassifier
from agno.memory.manager import MemoryManager
from agno.memory.summarizer import MemorySummarizer
from agno.storage.agent.sqlite import SqliteAgentStorage
from dotenv import load_dotenv
import os
import csv
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()
os.environ['GROQ_API_KEY'] = "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"
load_dotenv(dotenv_path="backend/.env")


# Initialize databases
agent_storage = SqliteAgentStorage(table_name="study_sessions", db_file="tmp/agents.db")

# CSV file for storing user prompts
memory_csv_file = "tmp/memory.csv"

# Create CSV file with headers if it doesn't exist
if not os.path.exists(memory_csv_file):
    with open(memory_csv_file, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["user_id", "session_id", "prompt", "timestamp"])

app = Flask(__name__)

CORS(app)

def store_user_prompt(user_id: str, session_id: str, prompt: str):
    """Stores user prompts in a CSV file."""
    with open(memory_csv_file, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([user_id, session_id, prompt, "CURRENT_TIMESTAMP"])

def create_mental_agent(user_id: str, session_id: str = None) -> Agent:
    return Agent(
        name="Helper",
        user_id=user_id,
        session_id=session_id,
        model=Groq(id="llama-3.3-70b-versatile"),
        memory=AgentMemory(
            create_user_memories=True,
            update_user_memories_after_run=True,
            classifier=MemoryClassifier(model=Groq(id="llama-3.3-70b-versatile")),
            summarizer=MemorySummarizer(model=Groq(id="llama-3.3-70b-versatile")),
            manager=MemoryManager(model=Groq(id="llama-3.3-70b-versatile"), user_id=user_id),
        ),
        storage=agent_storage,
        description="AI psychiatrist for engineering students",
        knowledge=JSONKnowledgeBase(
            path="mental-health-data.json",
            vector_db=LanceDb(
                uri="tmp/lancedb",
                table_name="mental-health",
                search_type=SearchType.hybrid,
                embedder=GeminiEmbedder(api_key=os.getenv("GEMINI_API_KEY")),
            )
        ),
        tools=[DuckDuckGoTools()],
        markdown=True,
        read_chat_history=True,
        search_knowledge=True
    )

@app.route('/chatWithBot', methods=['POST'])
def chat_handler():
    try:
        data = request.get_json()
        user_id = data.get("user_id", "default_user")
        message = data["message"]
        
        agent = create_mental_agent(user_id)
        response = agent.run(message=message, markdown=True)
        
        # Store user prompt in CSV file
        store_user_prompt(user_id, agent.session_id, message)
        
        return jsonify({
            "response": str(response.content),
            "session_id": agent.session_id,
            "user_id": user_id
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)