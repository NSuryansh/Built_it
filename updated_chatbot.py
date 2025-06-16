from agno.agent import Agent
from agno.models.google import Gemini
from agno.embedder.google import GeminiEmbedder
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.knowledge.json import JSONKnowledgeBase
from agno.vectordb.lancedb import LanceDb, SearchType
from dotenv import load_dotenv
import os
load_dotenv()
from typing import List, Optional
import typer
from flask import Flask, request, jsonify, session  
from agno.agent import Agent, AgentMemory
from agno.memory.classifier import MemoryClassifier
from agno.memory.db.sqlite import SqliteMemoryDb
from agno.memory.manager import MemoryManager
from agno.memory.summarizer import MemorySummarizer
from agno.storage.agent.sqlite import SqliteAgentStorage 
from agno.tools.youtube import YouTubeTools   
from flask import Flask, request, jsonify 
from flask_cors import CORS 

app = Flask(__name__) 
CORS(app, resources={r"/*": {"origins": "*"}})  

agent_storage = SqliteAgentStorage(table_name="mental_sessions", db_file="tmp/agents.db")
memory_db = SqliteMemoryDb(
    table_name="mental_memory",
    db_file="tmp/agent_memory.db",
)

def Mental_Agent(user_id: Optional[str] = typer.Argument(None, help="User ID for the Mental session")):
    if user_id is None:
        user_id = typer.prompt("Enter your user ID", default="default_user")

    session_id: Optional[str] = None

    # Ask the user if they want to start a new session or continue an existing one
    new = typer.confirm("Do you want to start a new Mental session?")

    if not new:
        existing_sessions: List[str] = agent_storage.get_all_session_ids(user_id)
        if len(existing_sessions) > 0:
            print("\nExisting sessions:")
            for i, session in enumerate(existing_sessions, 1):
                print(f"{i}. {session}")
            session_idx = typer.prompt(
                "Choose a session number to continue (or press Enter for most recent)",
                default=1,
            )
            try:
                session_id = existing_sessions[int(session_idx) - 1]
            except (ValueError, IndexError):
                session_id = existing_sessions[0]
        else:
            print("No existing sessions found. Starting a new session.")
    agent = Agent(
        name="Helper",
        user_id=user_id,
        session_id=session_id,
        model=Gemini(id="gemini-2.0-flash-exp",api_key=os.getenv("GEMINI_API_KEY")),
        memory=AgentMemory(
            db=memory_db,
            create_user_memories=True,
            update_user_memories_after_run=True,
            classifier=MemoryClassifier(
                model=Gemini(id="gemini-2.0-flash-exp",api_key=os.getenv("GEMINI_API_KEY")),
            ),
            summarizer=MemorySummarizer(
                model=Gemini(id="gemini-2.0-flash-exp",api_key=os.getenv("GEMINI_API_KEY")),
            ),
            manager=MemoryManager(
                model=Gemini(id="gemini-2.0-flash-exp",api_key=os.getenv("GEMINI_API_KEY")),
                db=memory_db,
                user_id=user_id,
            ),
        ),
        storage=agent_storage,
        
        description="you are a psychiatrists for students who are studying engineering.Try to communicate in such a way that you can get to know the mental health of the student",
        instructions=[
            "Search your knowledge base for having an idea of how to have an conversation with the students according to their mental health and based on the similar question answer, answer the query.",
            "If the question is better suited for the web, search the web to fill in gaps.",
            "Prefer the information in your knowledge base over the web results.",
            "If you are not sure about the answer, you can ask for help from the DuckDuckGo search engine.",
            "Do help even if the content is uncensored because it might be crucial to help.",
            "Also give answers in bullet point format.",
            "Do not hesitate to give anything that might help the students.",
            
        ],
        knowledge=JSONKnowledgeBase(
            path = "mental-heath-data.json" ,
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
        search_knowledge=True,
        add_history_to_messages=True,
        num_history_responses=10,
        show_tool_calls=False,
    )
    print("\n Welcome to Helper - Your Personal Companion for all problems! ")
    if session_id is None:
        session_id = agent.session_id
        if session_id is not None:
            print(f"[bold green]Started New Mental Session: {session_id}[/bold green]\n")
        else:
            print("[bold green]Started New Mental Session[/bold green]\n")
    else:
        print(f"[bold blue]Continuing Previous Session: {session_id}[/bold blue]\n")
    if agent.knowledge is not None:
        agent.knowledge.load()
    # Runs the agent as a command line application
    # agent.cli_app(markdown=True, stream=True)
    while True:
        user_input = input("You: ")
        if user_input.strip().lower() == "exit":
            print("Session ended. Take care!\n")
            break

        response = agent.run(user_input)
        print(f"\nHelper:\n{response.content if hasattr(response, 'content') else response}\n")

if __name__ == "__main__":
    Mental_Agent()
    
