from agno.agent import Agent
from agno.models.groq import Groq  
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

# Setting up storage for agents and memory
agent_storage = SqliteAgentStorage(table_name="study_sessions", db_file="tmp/agents.db")
memory_db = SqliteMemoryDb(
    table_name="study_memory",
    db_file="tmp/agent_memory.db",
)

def Mental_Agent(user_id: Optional[str] = typer.Argument(None, help="User ID for the study session")):
    if user_id is None:
        user_id = typer.prompt("Enter your user ID", default="default_user")

    session_id: Optional[str] = None

    # Fetch all previous session IDs for the user
    existing_sessions: List[str] = agent_storage.get_all_session_ids(user_id)

    if existing_sessions:
        print("\nExisting sessions:")
        for i, session in enumerate(existing_sessions, 1):
            print(f"{i}. {session}")

        # Allow user to select a session or continue from the latest
        session_idx = typer.prompt(
            "Choose a session number to continue (or press Enter for most recent)",
            default=1,
        )

        try:
            session_id = existing_sessions[int(session_idx) - 1]  # Retrieve selected session
        except (ValueError, IndexError):
            session_id = existing_sessions[0]  # Default to the most recent session
    else:
        print("No previous sessions found. Starting a new one.")

    # Initialize the chatbot with the selected session ID
    agent = Agent(
        name="Helper",
        user_id=user_id,
        session_id=session_id,  # Ensuring continuity of conversation
        model=Groq(id="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY")),
        memory=AgentMemory(
            db=memory_db,
            create_user_memories=True,
            update_user_memories_after_run=True,
            classifier=MemoryClassifier(
                model=Groq(id="llama-3.3-70b-versatile"),
            ),
            summarizer=MemorySummarizer(
                model=Groq(id="llama-3.3-70b-versatile"),
            ),
            manager=MemoryManager(
                model=Groq(id="llama-3.3-70b-versatile"),
                db=memory_db,
                user_id=user_id,
            ),
        ),
        storage=agent_storage,
        
        description="An AI psychiatrist supporting engineering students with their mental well-being.",
        instructions=[
            "Refer to your knowledge base to guide discussions based on students' mental health.",
            "If necessary, search the web for additional insights.",
            "Prioritize your stored knowledge over web results whenever possible."
        ],
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
        read_chat_history=True,  # Ensures past conversations are retrieved
        search_knowledge=True,
        add_history_to_messages=True,  # Keeps responses consistent with previous context
        num_history_responses=3,  # Pulls the last 3 interactions for better conversation flow
        show_tool_calls=False,
    )

    print("\n📚 Welcome to StudyScout - Your Personal Learning Companion! 🎓")

    # Inform the user whether they are starting fresh or continuing a session
    if session_id is None:
        session_id = agent.session_id
        if session_id is not None:
            print(f"Started a new study session: {session_id}\n")
        else:
            print("Started a new study session\n")
    else:
        print(f"Resuming previous session: {session_id}\n")

    # Load knowledge base if available
    if agent.knowledge is not None:
        agent.knowledge.load()

    # Run the chatbot as a CLI application
    agent.cli_app(markdown=True, stream=True)


if __name__ == "__main__":
    typer.run(Mental_Agent)
