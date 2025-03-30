import os
import pandas as pd
import json
from typing import List, Dict, Union
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
import collections
collections.Iterable = collections.abc.Iterable

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
    
    llm = ChatGoogleGenerativeAI(google_api_key=api_key, model="gemini-2.0-flash")
    output_parser = PydanticOutputParser(pydantic_object=MentalHealthMetrics)
    
    prompt = PromptTemplate(
        template="""Analyze the following chat conversation from a student.

Student ID: {student_id}

Chat History:
{chat_history}

Provide ONLY numerical scores following these strict guidelines:
1. Mental Health Score: 0-10 scale 
   - 0: Extremely poor mental health
   - 10: Excellent mental health
2. Stress Score: 0-10 scale
   - 0: No stress at all
   - 10: Extremely high stress
3. Academic Performance Score: 0-10 scale
   - 0: Critically poor academic performance
   - 10: Exceptional academic performance
4. Sleep Quality Score: 0-10 scale
   - 0: Extremely poor sleep (insomnia, constant interruptions)
   - 10: Perfect, restorative sleep with ideal duration and quality

{format_instructions}

IMPORTANT: Ensure scores are precise and based on the entire conversation context, paying special attention to any mentions of sleep, rest, tiredness, or energy levels.
""",
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



app = Flask(__name__)
CORS(app)  

@app.route('/analyze', methods=['POST'])
def analyze_user():
    data_id = request.get_json()
    user_id = data_id.get('user_id')
    print(user_id, "userof")
    try:
        # Load and filter CSV data
        data = pd.read_csv('tmp/memory.csv')
        user_data = data[data['user_id'] == int(user_id)]
        print(user_data)
        if user_data.empty:
            return jsonify({"error": "User not found"}), 404
            
        # Get prompts and calculate metrics
        prompts = user_data['prompt'].tolist()
        result = analyze_mental_health(prompts, user_id)
        
        return jsonify(result['metrics_json'])
        
    except FileNotFoundError:
        return jsonify({"error": "Data file missing"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)