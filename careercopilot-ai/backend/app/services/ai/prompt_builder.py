from typing import List, Dict, Any
from app.models.chat import ChatMessage
from app.core.config import settings

class PromptBuilder:
    """
    Constructs prompts and formats history for the Google Gemini API.
    """
    @staticmethod
    def get_system_instruction() -> str:
        """
        Return the global system prompt defining CareerCopilot AI's persona and constraints.
        """
        return (
            "You are CareerCopilot AI, a premium career-management assistant. "
            "You help users optimize their resumes, manage job applications, schedule mock interviews, "
            "and draft professional outreach emails.\n"
            "Be concise, highly professional, encouraging, and clear.\n"
            "Format your responses in clean Markdown. "
            "Under no circumstances do you execute actions (like sending emails or applying to jobs) "
            "directly; always require the user to perform the action."
        )

    @staticmethod
    def build_history(messages: List[ChatMessage], max_messages: int = None) -> List[Dict[str, Any]]:
        """
        Convert a list of DB ChatMessage instances into Google Gemini's standard content structure.
        Roles map from 'assistant' -> 'model', and 'user' -> 'user'.
        Clamps history to the last `max_messages` to prevent exceeding context window/rate boundaries.
        """
        limit = max_messages if max_messages is not None else settings.GEMINI_MAX_HISTORY_MESSAGES

        # Clamp history length
        if len(messages) > limit:
            messages = messages[-limit:]

        contents = []
        for msg in messages:
            role = "user" if msg.role == "user" else "model"
            contents.append({
                "role": role,
                "parts": [msg.content]
            })
        return contents

    @staticmethod
    def inject_rag_context(user_prompt: str, context_docs: List[str] = None) -> str:
        """
        Future RAG Placeholder: Injects relevant external context (e.g. parsed resume text, 
        job descriptions, or database schemas) into the user prompt turn.
        """
        if not context_docs:
            return user_prompt
        
        context_str = "\n".join([f"- {doc}" for doc in context_docs])
        return (
            f"Context Information:\n{context_str}\n\n"
            f"User Prompt:\n{user_prompt}"
        )
