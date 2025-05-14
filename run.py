from agno.agent import Agent, AgentMemory 
from agno.models.google import Gemini 
from agno.embedder.google import GeminiEmbedder 
from agno.tools.duckduckgo import DuckDuckGoTools 
from agno.knowledge.json import JSONKnowledgeBase 
from agno.vectordb.lancedb import LanceDb, SearchType 
from dotenv import load_dotenv 
import os 
from flask import Flask, request, jsonify 
from flask_cors import CORS 
from agno.memory.classifier import MemoryClassifier 
from agno.memory.db.sqlite import SqliteMemoryDb 
from agno.memory.manager import MemoryManager 
from agno.memory.summarizer import MemorySummarizer 
from agno.storage.agent.sqlite import SqliteAgentStorage   
from updated_chatbot import Mental_Agent

# Initialize Flask app 
app = Flask(__name__) 
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes  

# Load environment variables 
backend_path = os.path.join(os.path.dirname(__file__), 'backend', '.env') 
load_dotenv(backend_path) 
api_key = os.getenv("GOOGLE_API_KEY")  

if not api_key:     
    raise ValueError("GOOGLE_API_KEY is not set in the environment variables.")  

# Set up storage and memory 
agent_storage = SqliteAgentStorage(table_name="mental_sessions", db_file="tmp/agents.db") 
memory_db = SqliteMemoryDb(table_name="mental_memory", db_file="tmp/agent_memory.db")  

# Create Agent instance 
def create_mental_agent(user_id: str, session_id: str = None) -> Agent:     
    return Agent(         
        name="Helper",         
        user_id=user_id,         
        session_id=session_id,         
        model=Gemini(id="gemini-2.0-flash-exp", api_key=api_key),         
        memory=AgentMemory(             
            db=memory_db,             
            create_user_memories=True,             
            update_user_memories_after_run=True,             
            classifier=MemoryClassifier(model=Gemini(id="gemini-2.0-flash-exp", api_key=api_key)),             
            summarizer=MemorySummarizer(model=Gemini(id="gemini-2.0-flash-exp", api_key=api_key)),             
            manager=MemoryManager(model=Gemini(id="gemini-2.0-flash-exp", api_key=api_key), db=memory_db, user_id=user_id),         
        ),         
        storage=agent_storage,         
        description="You are a psychiatrist for engineering students.",         
        instructions=[             
            "Search your knowledge base for relevant conversations based on students' mental health.",             
            "If needed, search the web to fill in gaps.",             
            "Prefer internal knowledge over web results.",             
            "If unsure, use DuckDuckGo search.",             
            "Assist even if content is uncensored, as it might be crucial."         
        ],         
        knowledge=JSONKnowledgeBase(             
            path="mental-health-data.json",             
            vector_db=LanceDb(                 
                uri="tmp/lancedb",                 
                table_name="mental-health",                 
                search_type=SearchType.hybrid,                 
                embedder=GeminiEmbedder(api_key=api_key),             
            )         
        ),         
        tools=[DuckDuckGoTools()],         
        markdown=True,         
        read_chat_history=True,         
        search_knowledge=True,         
        add_history_to_messages=True,         
        num_history_responses=3,         
        show_tool_calls=False,     
    )  

@app.route('/chat', methods=['POST']) 
def chat():     
    try:         
        # data = request.get_json()         
        # user_id = data.get("user_id", "default_user")         
        # user_message = data.get("message", "")          
        
        # if not user_message:             
        #     return jsonify({"error": "Empty message"}), 400          
        
        # # Create an agent instance for the user         
        # agent = create_mental_agent(user_id)          
        
        # # Get response from the agent         
        # response_obj = agent.run(user_message)          
        
        # # Extract just the text content 
        # # If it's a RunResponse object, extract the 'content' attribute
        # if hasattr(response_obj, 'content'):
        #     bot_response = response_obj.content.strip()
        # # If it's a dictionary, try to get 'text' or convert to string
        # elif isinstance(response_obj, dict):
        #     bot_response = response_obj.get('text', str(response_obj)).strip()
        # # Otherwise, convert to string
        # else:
        #     bot_response = str(response_obj).strip()
        
        # # Return response with session ID         
        # return jsonify({
        #     "response": {"text": bot_response}, 
        #     "session_id": agent.session_id
        # })     
        Mental_Agent()
    except Exception as e:         
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':     
    app.run(host="0.0.0.0", port=5000, debug=True)