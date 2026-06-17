import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_community.utilities import TavilySearchAPIWrapper
from langchain_community.tools.tavily_search.tool import TavilyQueryResult

class StartupAgentsSwarm:
  def __init__(self):
    self.api_key = os.getenv("GEMINI_API_KEY")
    self.tavily_key = os.getenv("TAVILY_API_KEY")
    
    # Initialize LLM
    if self.api_key and self.api_key != "mock_gemini_key":
      self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro", google_api_key=self.api_key, temperature=0.7)
      self.fast_llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=self.api_key, temperature=0.2)
    else:
      # Mock LLM for local development when key is empty
      self.llm = None
      self.fast_llm = None
      print("⚠️ Operating in Mock LLM mode (GEMINI_API_KEY not set).")

  def get_tavily_search_results(self, query: str) -> str:
    if self.tavily_key and self.tavily_key != "mock_tavily_key":
      try:
        search = TavilySearchAPIWrapper(tavily_api_key=self.tavily_key)
        return str(search.results(query, max_results=3))
      except Exception as e:
        print(f"Search API failed: {e}")
        return "Search error occurred."
    return f"[Mock Web Search Result for '{query}']: High market growth, strong segment interest, few primary software competitors."

  def run_validator_agent(self, data: dict) -> dict:
    if not self.llm:
      # Return realistic mock response
      return {
        "validation_score": 82,
        "risk_score": 35,
        "market_demand": "High consumer interest in automation tools.",
        "competition_analysis": "Fragmented market. High growth potential.",
        "risk_analysis": "Execution and customer acquisition costs present highest risks.",
        "recommendations": ["Optimize landing page conversion.", "Engage seed VCs early."]
      }

    prompt = ChatPromptTemplate.from_messages([
      ("system", "You are an expert VC Investor and Startup Validator. Validate the following startup idea and return a JSON structure with fields: validation_score (integer 0-100), risk_score (integer 0-100), market_demand (text), competition_analysis (text), risk_analysis (text), recommendations (list of strings)."),
      ("user", "Startup Name: {name}\nIndustry: {industry}\nDescription: {description}\nBusiness Model: {business_model}\nWeb Search Context: {context}")
    ])

    search_query = f"{data.get('name')} {data.get('industry')} market validation competitors"
    context = self.get_tavily_search_results(search_query)

    chain = prompt | self.llm | JsonOutputParser()
    try:
      response = chain.invoke({
        "name": data.get("name"),
        "industry": data.get("industry"),
        "description": data.get("description"),
        "business_model": data.get("business_model"),
        "context": context
      })
      return response
    except Exception as e:
      print(f"Validator Agent failed: {e}")
      return {"validation_score": 70, "risk_score": 45, "market_demand": "Error running validation agent."}

  def run_business_planner_agent(self, data: dict) -> str:
    if not self.llm:
      return "# Business Plan: " + data.get("name") + "\n\n## Executive Summary\nGenerating high scalability SaaS platform...\n\n## Market Opportunity\nAddressable target market estimate is $5B."

    prompt = ChatPromptTemplate.from_messages([
      ("system", "You are a Chief Business Planner Agent. Generate a comprehensive business plan in Markdown format including: Executive Summary, Market Analysis, Revenue Streams, Cost Structure, Growth Strategy, and 3-Year Financial Estimates."),
      ("user", "Startup details: {data}")
    ])

    chain = prompt | self.llm | StrOutputParser()
    try:
      return chain.invoke({"data": json.dumps(data)})
    except Exception as e:
      return f"Error compiling business plan: {str(e)}"

  def run_competitor_analysis_agent(self, data: dict) -> dict:
    if not self.llm:
      return {
        "competitors": [{"name": "CompeteCorp", "price": "$19/mo", "features": "Basic Analytics"}],
        "swot": {"strengths": "Proprietary AI", "weaknesses": "Team size", "opportunities": "API launch", "threats": "Low cost copies"},
        "market_positioning": "Premium automated builder tool"
      }

    prompt = ChatPromptTemplate.from_messages([
      ("system", "You are a Competitor Analyst Agent. Analyze the competitive space and return a JSON structure with keys: competitors (list of dicts containing name, price, features), swot (dict of strings: strengths, weaknesses, opportunities, threats), market_positioning (string)."),
      ("user", "Startup Name: {name}\nDescription: {description}\nIndustry: {industry}\nSearch Results: {context}")
    ])

    search_query = f"{data.get('name')} {data.get('industry')} competitors pricing model"
    context = self.get_tavily_search_results(search_query)

    chain = prompt | self.llm | JsonOutputParser()
    try:
      return chain.invoke({
        "name": data.get("name"),
        "description": data.get("description"),
        "industry": data.get("industry"),
        "context": context
      })
    except Exception as e:
      print(f"Competitor Agent failed: {e}")
      return {"competitors": [], "swot": {}, "market_positioning": "Error"}

  def run_pitch_deck_agent(self, data: dict) -> dict:
    if not self.llm:
      return {
        "problem": "Founders waste time writing business documents.",
        "solution": "StartupForge AI builds enterprise documents in seconds.",
        "market": "100M global startups annually.",
        "slides": ["Problem Slide", "Solution Slide", "Market Size", "Business Model", "Investment Ask"]
      }

    prompt = ChatPromptTemplate.from_messages([
      ("system", "You are an Investment Pitch Deck Designer. Create slide details and return JSON with keys: problem, solution, market, slides (list of slide titles/descriptions)."),
      ("user", "Startup Data: {data}")
    ])

    chain = prompt | self.llm | JsonOutputParser()
    try:
      return chain.invoke({"data": json.dumps(data)})
    except Exception as e:
      return {"problem": "Error", "solution": "Error", "market": "Error", "slides": []}

  def run_mvp_planner_agent(self, data: dict) -> dict:
    if not self.llm:
      return {
        "architecture": "React Native Frontend with Python microservices",
        "user_stories": ["As a founder, I want to predict success scores", "As an investor, I want to filter startups"],
        "roadmap": ["Sprint 1: DB schemas & Core API", "Sprint 2: AI Agents integration", "Sprint 3: Mobile dashboard UI"]
      }

    prompt = ChatPromptTemplate.from_messages([
      ("system", "You are a CTO MVP Planner Agent. Outline the MVP roadmap. Return JSON with keys: architecture, user_stories (list of strings), roadmap (list of sprints)."),
      ("user", "Startup Requirements: {data}")
    ])

    chain = prompt | self.llm | JsonOutputParser()
    try:
      return chain.invoke({"data": json.dumps(data)})
    except Exception as e:
      return {"architecture": "Error", "user_stories": [], "roadmap": []}

  def run_advisor_agent(self, conversation_history: list, user_message: str, rag_context: str) -> str:
    if not self.llm:
      return "I am StartupForge's AI Advisor. To assist you with your startup, please configure your Gemini API keys."

    prompt = ChatPromptTemplate.from_messages([
      ("system", "You are StartupForge's interactive Startup Advisor. Answer the founder's query using the provided context and history.\n\nRAG Context:\n{rag_context}"),
      ("placeholder", "{history}"),
      ("user", "{message}")
    ])

    # Transform logs history list to tuple format for LangChain prompt placeholders
    history_messages = []
    for msg in conversation_history[-6:]: # last 6 messages
      role = "user" if msg["sender"] == "founder" else "assistant"
      history_messages.append((role, msg["text"]))

    chain = prompt | self.llm | StrOutputParser()
    try:
      return chain.invoke({
        "rag_context": rag_context,
        "history": history_messages,
        "message": user_message
      })
    except Exception as e:
      return f"Error executing advisory chat agent: {e}"
