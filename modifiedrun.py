from agno.agent import Agent, AgentMemory
from agno.models.groq import Groq  
from agno.embedder.google import GeminiEmbedder
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.knowledge.json import JSONKnowledgeBase
from agno.vectordb.lancedb import LanceDb, SearchType
from agno.memory.classifier import MemoryClassifier
from agno.memory.db.sqlite import SqliteMemoryDb
from agno.memory.manager import MemoryManager
from agno.memory.summarizer import MemorySummarizer
from agno.storage.agent.sqlite import SqliteAgentStorage    
from dotenv import load_dotenv
import os
import typer
from typing import List, Optional

load_dotenv()
os.environ['GROQ_API_KEY'] = "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"
AGENT_DB_PATH = "tmp/agents.db"
MEMORY_DB_PATH = "tmp/agent_memory.db"

agent_storage = SqliteAgentStorage(table_name="study_sessions", db_file=AGENT_DB_PATH)
memory_db = SqliteMemoryDb(table_name="study_memory", db_file=MEMORY_DB_PATH)

def fetch_previous_sessions(user_id: str) -> List[str]:
    return agent_storage.get_all_session_ids(user_id)

def load_existing_memory(session_id: str):
    memories = memory_db.read_memories(user_id=session_id)
    return memories if memories else []

def Mental_Agent(user_id: Optional[str] = typer.Argument(None, help="User ID for the study session")):
    if user_id is None:
        user_id = typer.prompt("Enter your user ID", default="default_user")

    session_id: Optional[str] = None
    existing_sessions = fetch_previous_sessions(user_id)

    if existing_sessions:
        print("\nExisting Sessions:")
        for i, session in enumerate(existing_sessions, 1):
            print(f"{i}. {session}")

        session_idx = typer.prompt("Choose a session number to continue (or press Enter for most recent)", default=1)

        try:
            session_id = existing_sessions[int(session_idx) - 1]
        except (ValueError, IndexError):
            session_id = existing_sessions[0]

    agent = Agent(
        name="Helper",
        user_id=user_id,
        session_id=session_id,
        model=Groq(id="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY")),
        memory=AgentMemory(
            db=memory_db,
            create_user_memories=True,
            update_user_memories_after_run=True,
            classifier=MemoryClassifier(model=Groq(id="llama-3.3-70b-versatile")),
            summarizer=MemorySummarizer(model=Groq(id="llama-3.3-70b-versatile")),
            manager=MemoryManager(model=Groq(id="llama-3.3-70b-versatile"), db=memory_db, user_id=user_id),
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
        read_chat_history=True,
        search_knowledge=True,
        add_history_to_messages=True,
        num_history_responses=3,
        show_tool_calls=False,
    )

    if session_id is None:
        session_id = agent.session_id
        print(f"Started a new session: {session_id}")
    else:
        print(f"Resuming session: {session_id}")

    past_memories = load_existing_memory(session_id)
    if past_memories:
        print(f"Loaded {len(past_memories)} previous memory entries.")
        agent.memory.load_memories(past_memories)

    if agent.knowledge is not None:
        agent.knowledge.load()

    agent.cli_app(markdown=True, stream=True)

if __name__ == "__main__":
    typer.run(Mental_Agent)