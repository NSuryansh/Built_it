from agno.agent import Agent, AgentMemory
from agno.models.groq import Groq  
from agno.embedder.google import GeminiEmbedder
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.knowledge.json import JSONKnowledgeBase
from agno.vectordb.lancedb import LanceDb, SearchType
from agno.memory.classifier import MemoryClassifier
from agno.memory.manager import MemoryManager
from agno.memory.summarizer import MemorySummarizer
import lancedb
from agno.storage.agent.sqlite import SqliteAgentStorage
# from agno.memory import LanceMemoryDb
from dotenv import load_dotenv
import os
import csv
from huggingface_hub import InferenceClient
from agno.models.google import Gemini 
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import pandas as pd
import json
from typing import List, Dict, Union
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from flask import Flask, jsonify, request
import pandas as pd
import tempfile
import os
import collections
import torch
from transformers import AutoProcessor, AutoModelForAudioClassification,AutoFeatureExtractor
import librosa
import numpy as np

collections.Iterable = collections.abc.Iterable

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
api_key_hf = os.getenv("HF_API_KEY")


# Initialize databases
agent_storage = SqliteAgentStorage(table_name="study_sessions", db_file="tmp/agents.db")

# CSV file for storing user prompts
memory_csv_file = "tmp/memory.csv"

db_path = "tmp/lancedb"  # Choose a path to store your LanceDB data
lance_db = lancedb.connect(db_path)

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

global agent_knowledge_base
try:
    agent_knowledge_base = JSONKnowledgeBase(
        path="mental-health-data.json",
        vector_db=LanceDb(
            uri="tmp/lancedb",
            table_name="mental-health",
            search_type=SearchType.hybrid,
            embedder=GeminiEmbedder(api_key=os.getenv("GEMINI_API_KEY")),
        )
    )
except Exception as e:
    print(f"Error initializing knowledge base: {e}")
    agent_knowledge_base = None  # Handle initialization failure


def create_mental_agent(user_id: str, session_id: str = None) -> Agent:
    return Agent(
        name="Helper",
        user_id=user_id,
        session_id=session_id,
        model=Gemini(id="gemini-2.0-flash-exp", api_key=api_key),
        memory=AgentMemory(
            create_user_memories=True,
            update_user_memories_after_run=True,
            classifier=MemoryClassifier(model=Gemini(id="gemini-2.0-flash-exp", api_key=api_key)),
            summarizer=MemorySummarizer(model=Gemini(id="gemini-2.0-flash-exp", api_key=api_key)),
            manager=MemoryManager(model=Gemini(id="gemini-2.0-flash-exp", api_key=api_key), user_id=user_id),
            memory_db=lance_db,
            storage=agent_storage,
        ),
        storage=agent_storage,
        instructions=["You are a helpful mental health assistant for engineering students. Keep your responses concise and to the point." 
    "Limit your responses to 2-3 short sentences whenever possible. Focus on practical advice and avoid lengthy explanations."
    "Only provide detailed information when explicitly requested."     
        ], 
        description="AI psychiatrist for engineering students",
        knowledge=agent_knowledge_base,
        tools=[DuckDuckGoTools()],
        markdown=True,
        read_chat_history=True,
        search_knowledge=True
    )



# Define MentalHealthMetrics model
class MentalHealthMetrics(BaseModel):
    mental_health_score: float = Field(description="Mental health score (0-10 scale)")
    stress_score: float = Field(description="Stress score (0-10 scale)")
    academic_performance_score: float = Field(description="Academic performance score (0-10 scale)")
    sleep_quality_score: float = Field(description="Sleep quality score (0-10 scale)")

# Function to analyze mental health metrics
def analyze_mental_health(messages: List[str], student_id: str = "STUDENT_DEFAULT", api_key: str = None) -> Dict[str, Union[MentalHealthMetrics, Dict]]:
    api_key = "AIzaSyA14oa8vKeVWZsYAyRpel8sGOAp4bo9MaY"
    if not api_key:
        raise ValueError("Google API Key must be provided")
    print("LLM")
    llm = ChatGoogleGenerativeAI(google_api_key=api_key, model="gemini-2.0-flash")
    print("PARSER")
    output_parser = PydanticOutputParser(pydantic_object=MentalHealthMetrics)
    print("PROMPT")
    prompt = PromptTemplate(
    template="""Analyze the following chat conversation from a student.

Student ID: {student_id}

Chat History:
{chat_history}

Provide ONLY numerical scores following these strict guidelines:
1. Mental Health Score: 0-10 scale 
   - 0: Extremely poor mental health
   - 10: Excellent mental health
   - 11: Insufficient data to determine a score
2. Stress Score: 0-10 scale
   - 0: No stress at all
   - 10: Extremely high stress
   - 11: Insufficient data to determine a score
3. Academic Performance Score: 0-10 scale
   - 0: Critically poor academic performance
   - 10: Exceptional academic performance
   - 11: Insufficient data to determine a score
4. Sleep Quality Score: 0-10 scale
   - 0: Extremely poor sleep (insomnia, constant interruptions)
   - 10: Perfect, restorative sleep with ideal duration and quality
   - 11: Insufficient data to determine a score

{format_instructions}

IMPORTANT: Ensure scores are precise and based on the entire conversation context, paying special attention to any mentions of sleep, rest, tiredness, or energy levels. If there is not enough data to confidently determine a score for any category, return 11 instead.""",
        input_variables=["student_id", "chat_history"],
        partial_variables={
            "format_instructions": output_parser.get_format_instructions()
        }
    )
    
    chat_context = "\n".join(messages)
    
    try:
        chain_input = {"student_id": student_id, "chat_history": chat_context}
        response = llm.invoke(prompt.format_prompt(**chain_input))
        metrics = output_parser.parse(response.content)
        
        metrics_dict = {
            "mental_health_score": metrics.mental_health_score,
            "stress_score": metrics.stress_score,
            "academic_performance_score": metrics.academic_performance_score,
            "sleep_quality_score": metrics.sleep_quality_score,
        }
        
        return {
            "metrics_model": metrics,
            "metrics_json": metrics_dict,
            "json_string": json.dumps(metrics_dict)
        }
    
    except Exception as e:
        print(f"Error in metric calculation: {e}")
        
        default_metrics = MentalHealthMetrics(
            mental_health_score=3.0,
            stress_score=3.0,
            academic_performance_score=3.0,
            sleep_quality_score=3.0
        )
        
        default_dict = {
            "mental_health_score": 3.0,
            "stress_score": 3.0,
            "academic_performance_score": 3.0,
            "sleep_quality_score": 3.0
        }
        
        return {
            "metrics_model": default_metrics,
            "metrics_json": default_dict,
            "json_string": json.dumps(default_dict)
        }

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response
    

@app.route('/chatWithBot', methods=['POST', 'OPTIONS'])
@cross_origin()
def chat_handler():
    if request.method == "POST":
        try:
            print("HIHI")
            data = request.get_json()
            user_id = data.get("user_id", "default_user")
            print(type(user_id), "user id type")

            print("USER ID:", user_id)
            message = data["message"]
            message=message+"Reply in 2-3 sentences only and avoid lengthy explanations. Provide detailed information only when explicitly requested."
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
    if request.method=='OPTIONS':
        print("HALALALLALA options")
        return '', 200


@app.route("/analyze", methods=["POST", "OPTIONS"])
@cross_origin()  
def analyze_user():
    # print(request)
    if request.method=='POST':
        data_id = request.get_json()
        # print(data_id, "data id")
        user_id = data_id.get('user_id')
        
        # print(user_id, "user id")
        # print(type(user_id), "user id type")
        try:
            # Load and filter CSV data
            data = pd.read_csv('tmp/memory.csv', dtype={'user_id': str})
            # print(data, "dara")
            user_data = data[data['user_id'] == str(user_id)]
            # print(user_data, "AEEE HALLLLLo")
            if user_data.empty:
                print("empty data")
                return jsonify({"error": "User not found"}), 404
                
            # Get prompts and calculate metrics
            prompts = user_data['prompt'].tolist()
            
            # print("HELEoooo")
            result = analyze_mental_health(prompts, user_id)
            
            return jsonify(result['metrics_json'])
            
        except FileNotFoundError:
            return jsonify({"error": "Data file missing"}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    if request.method=='OPTIONS':
        # print("HALALALLALA options")
        return '', 200
    
@app.route('/emotion', methods=['POST', 'OPTIONS'])
@cross_origin()
def classify_emotion():
    print("EMOTION")
    if request.method == "POST":
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file uploaded"}), 400

        audio_file = request.files['audio']

        # Save to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            audio_file.save(temp_audio.name)
            audio_path = temp_audio.name

        print(audio_path, "AUDIO PATH")

        # For testing purposes, override the audio_path if needed:
        # audio_path = "C:\\Users\\Shorya\\AppData\\Local\\Temp\\tmplgilil_u.wav"

        client = InferenceClient(
            provider="hf-inference",
            api_key=api_key_hf,
        )

        output = client.audio_classification(
            audio_path,
            model="ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
        )
        print(output)

        # Create a list of dictionaries for each classification element
        results = [{"label": elem.label, "score": elem.score} for elem in output]

        # Find the element with the maximum score
        max_elem = max(output, key=lambda elem: elem.score)

        # Return all the results along with the max label
        return jsonify({
            "results": results,
            "max_emotion": max_elem.label
        })
        # except Exception as e:
        #     print("❌ Error occurred during emotion classification:")
        #     return jsonify({"error": str(e)}), 500
    if request.method=='OPTIONS':
        print("HALALALLALA options")
        return '', 200
    
        
if __name__ == "__main__":
       with app.app_context():
        app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 5000)), debug=True)