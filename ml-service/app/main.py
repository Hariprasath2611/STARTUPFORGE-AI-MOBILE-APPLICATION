from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from app.predictors.models import StartupPredictors

app = FastAPI(title="StartupForge ML Engine", version="1.0.0")
predictor = StartupPredictors()

# Schemas
class SuccessRequest(BaseModel):
  industry: str
  market_size: int
  competition: str
  funding_stage: str
  business_model: str
  revenue_projections: float
  team_composition: List[str]
  technology_stack: List[str]

class ForecastRequest(BaseModel):
  initial_capital: float
  burn_rate: float
  customer_growth: float
  cac: float
  ltv: float

class CoFounderCandidate(BaseModel):
  id: str
  skills: List[str]

class CoFounderRequest(BaseModel):
  user_skills: List[str]
  candidates: List[CoFounderCandidate]

class InvestorRequest(BaseModel):
  industry: str
  funding_stage: str
  funding_needed: float

@app.get("/health")
def health():
  return {"status": "UP", "service": "StartupForge ML Service"}

@app.post("/predict/success")
def predict_success(request: SuccessRequest):
  result = predictor.predict_success(request.dict())
  return result

@app.post("/predict/forecast")
def predict_forecast(request: ForecastRequest):
  result = predictor.calculate_forecast(request.dict())
  return result

@app.post("/predict/cofounders")
def match_cofounders(request: CoFounderRequest):
  candidates_list = [c.dict() for c in request.candidates]
  result = predictor.match_cofounders(request.user_skills, candidates_list)
  return {"matches": result}

@app.post("/predict/investors")
def recommend_investors(request: InvestorRequest):
  result = predictor.recommend_investors(request.industry, request.funding_stage, request.funding_needed)
  return {"recommendations": result}
