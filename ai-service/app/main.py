import os
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
from app.agents.agents_swarm import StartupAgentsSwarm
from app.rag.rag_manager import RAGManager

app = FastAPI(title="StartupForge AI Service", version="1.0.0")

# Initialize managers
swarm = StartupAgentsSwarm()
rag = RAGManager()

# Request schemas
class ValidationRequest(BaseModel):
  name: str
  description: str
  industry: str
  funding_stage: str
  business_model: str

class BusinessPlanRequest(BaseModel):
  name: str
  tagline: Optional[str] = ""
  description: str
  industry: str
  targetMarket: Optional[str] = ""
  businessModel: str
  fundingStage: str

class CompetitorsRequest(BaseModel):
  name: str
  description: str
  industry: str

class PitchDeckRequest(BaseModel):
  name: str
  tagline: str
  description: str
  industry: str
  fundingStage: str

class MVPPlannerRequest(BaseModel):
  name: str
  description: str
  industry: str
  technologyStack: List[str]

class ChatMessage(BaseModel):
  sender: str # 'founder' or 'advisor'
  text: str

class AdvisorChatRequest(BaseModel):
  startup_id: str
  message: str
  history: List[ChatMessage]

@app.get("/health")
def health_check():
  return {"status": "UP", "service": "StartupForge AI Service"}

@app.post("/ai/validate")
def validate_idea(request: ValidationRequest):
  result = swarm.run_validator_agent(request.dict())
  return result

@app.post("/ai/business-plan")
def generate_business_plan(request: BusinessPlanRequest):
  plan = swarm.run_business_planner_agent(request.dict())
  return {"business_plan": plan}

@app.post("/ai/competitors")
def analyze_competitors(request: CompetitorsRequest):
  result = swarm.run_competitor_analysis_agent(request.dict())
  return result

@app.post("/ai/pitch-deck")
def generate_pitch_deck(request: PitchDeckRequest):
  result = swarm.run_pitch_deck_agent(request.dict())
  return result

@app.post("/ai/mvp-planner")
def plan_mvp(request: MVPPlannerRequest):
  result = swarm.run_mvp_planner_agent(request.dict())
  return result

@app.post("/ai/advisor/chat")
def chat_with_advisor(request: AdvisorChatRequest):
  # Get contextual insights from PDF RAG database
  rag_context = rag.retrieve_context(query=request.message, startup_id=request.startup_id)
  
  # Format conversation history
  history_list = [{"sender": h.sender, "text": h.text} for h in request.history]
  
  reply = swarm.run_advisor_agent(
    conversation_history=history_list,
    user_message=request.message,
    rag_context=rag_context
  )
  return {"reply": reply}

@app.post("/ai/rag/ingest")
async def ingest_document(
  startup_id: str = Form(...),
  file: UploadFile = File(...)
):
  # Save file locally first
  os.makedirs("temp_uploads", exist_ok=True)
  file_path = f"temp_uploads/{file.filename}"
  
  with open(file_path, "wb") as buffer:
    buffer.write(await file.read())
    
  success = rag.ingest_document(file_path=file_path, startup_id=startup_id)
  
  # Clean up temp file
  if os.path.exists(file_path):
    os.remove(file_path)
    
  if not success:
    raise HTTPException(status_code=500, detail="Document embedding vector mapping failed")
    
  return {"status": "success", "message": "Document ingested and semantic indexes upserted"}
