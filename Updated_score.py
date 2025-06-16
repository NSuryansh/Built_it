import os
from dotenv import load_dotenv
from typing import List, Dict, Optional

from langchain.chat_models import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import JsonOutputParser
from langchain.schema import BaseOutputParser

load_dotenv()  

class MentalHealthAnalyzer:
    def __init__(self, student_id: str):
        self.student_id = student_id
        self.chat_history: List[str] = []
        self.last_calculated_metrics = None

        # Gemini LLM
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=os.getenv("GEMINI_API_KEY"),
            temperature=0.2
        )

        # JSON Output Parser
        self.parser: BaseOutputParser = JsonOutputParser()

        # Prompt Template
        self.prompt = PromptTemplate(
            template="""
Analyze the following conversation from a student at IIT Indore.

Student ID: {student_id}

Chat History:
{chat_history}

Return a JSON with:
{{
  "mental_health_score": float (0-5),
  "stress_score": float (0-5),
  "academic_performance_score": float (0-5),
  "rationale": {{
    "mental_health": "reasoning",
    "stress": "reasoning",
    "academic_performance": "reasoning"
  }},
  "key_observations": [
    "observation 1",
    "observation 2"
  ]
}}

Respond ONLY in JSON format.
""",
            input_variables=["student_id", "chat_history"]
        )

    def add_message(self, message: str) -> Optional[Dict]:
        self.chat_history.append(message)

        if len(self.chat_history) >= 5:
            return self._analyze()

        return None

    def _analyze(self) -> Dict:
        full_prompt = self.prompt.format(
            student_id=self.student_id,
            chat_history="\n".join(self.chat_history)
        )

        response = self.llm.predict(full_prompt)
        parsed = self.parser.parse(response)

        if self.last_calculated_metrics:
            def smooth(new, old):
                return max(0, min(old + max(min(new - old, 1.0), -1.0), 5))

            parsed["mental_health_score"] = smooth(parsed["mental_health_score"], self.last_calculated_metrics["mental_health_score"])
            parsed["stress_score"] = smooth(parsed["stress_score"], self.last_calculated_metrics["stress_score"])
            parsed["academic_performance_score"] = smooth(parsed["academic_performance_score"], self.last_calculated_metrics["academic_performance_score"])

        self.last_calculated_metrics = {
            "mental_health_score": parsed["mental_health_score"],
            "stress_score": parsed["stress_score"],
            "academic_performance_score": parsed["academic_performance_score"]
        }

        return parsed

# Example usage
# if __name__ == "__main__":
#     analyzer = MentalHealthAnalyzer("IIT_STUDENT_001")
#     messages = [
#         "I'm feeling a bit stressed about my upcoming exams",
#         "The workload is getting intense",
#         "I'm struggling to balance my studies and personal life",
#         "I'm worried about my performance in the semester",
#         "I feel like I'm falling behind in my coursework"
#     ]

#     for msg in messages:
#         result = analyzer.add_message(msg)
#         if result:
#             print(result)
