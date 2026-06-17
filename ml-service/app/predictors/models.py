import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any

class StartupPredictors:
  def __init__(self):
    # Dummy weights for our success evaluator matrix
    self.industry_factors = {
      "saas": 0.85, "fintech": 0.82, "ai": 0.90, "healthcare": 0.78, "e-commerce": 0.65, "web3": 0.55
    }
    
    # Static database of simulated investors for matching
    self.investors_db = [
      {"name": "Sequoia Capital", "industries": ["saas", "ai", "fintech"], "stage": "Seed", "min_check": 500000, "max_check": 5000000},
      {"name": "Y Combinator", "industries": ["saas", "ai", "fintech", "healthcare", "e-commerce"], "stage": "Idea", "min_check": 125000, "max_check": 500000},
      {"name": "Andreessen Horowitz", "industries": ["ai", "web3", "saas"], "stage": "Seed", "min_check": 1000000, "max_check": 10000000},
      {"name": "Founder Collective", "industries": ["saas", "e-commerce"], "stage": "Pre-Seed", "min_check": 100000, "max_check": 1000000},
      {"name": "Techstars", "industries": ["saas", "fintech", "ai", "healthcare"], "stage": "Idea", "min_check": 20000, "max_check": 120000}
    ]

  def predict_success(self, data: Dict[str, Any]) -> Dict[str, Any]:
    industry = data.get("industry", "").lower()
    stage = data.get("funding_stage", "Idea")
    team_size = len(data.get("team_composition", []))
    tech_stack_size = len(data.get("technology_stack", []))
    revenue = data.get("revenue_projections", 0)

    # Success probability scoring based on inputs
    base_factor = self.industry_factors.get(industry, 0.70)
    
    stage_bonus = {
      "Idea": 0.05, "Pre-Seed": 0.10, "Seed": 0.15, "SeriesA": 0.20, "Growth": 0.25
    }.get(stage, 0.05)

    team_bonus = min(team_size * 0.03, 0.15)
    tech_bonus = min(tech_stack_size * 0.02, 0.10)
    rev_bonus = min((revenue / 1000000) * 0.05, 0.10)

    success_probability = base_factor + stage_bonus + team_bonus + tech_bonus + rev_bonus
    success_probability = min(max(success_probability, 0.20), 0.95)

    # Risk factor formula (inverse correlation)
    risk_score = 1.0 - success_probability + (0.15 if stage == "Idea" else 0.0)
    risk_score = min(max(risk_score, 0.10), 0.90)

    # Decision thresholds
    investment_readiness = success_probability - (risk_score * 0.2)
    growth_potential = "High" if success_probability > 0.75 else "Medium" if success_probability > 0.50 else "Low"

    return {
      "success_probability": round(float(success_probability), 2),
      "risk_score": round(float(risk_score), 2),
      "investment_readiness": round(float(investment_readiness), 2),
      "growth_potential": growth_potential,
      "confidence_score": 0.85
    }

  def calculate_forecast(self, data: Dict[str, Any]) -> Dict[str, Any]:
    initial_capital = data.get("initial_capital", 100000)
    burn_rate = data.get("burn_rate", 8000)
    growth = data.get("customer_growth", 5) / 100.0
    cac = data.get("cac", 50)
    ltv = data.get("ltv", 250)

    projections = []
    cash = initial_capital
    customers = 50.0
    monthly_arpu = ltv / 12.0

    for month in range(1, 37):
      # Customers grow compounding
      customers = customers * (1 + growth)
      revenue = customers * monthly_arpu
      
      # Monthly spending includes base burn + client acquisition cost
      costs = burn_rate + (customers * growth * cac)
      cash = cash + revenue - costs
      cash = max(cash, 0.0)

      projections.append({
        "month": month,
        "revenue": int(round(revenue)),
        "costs": int(round(costs)),
        "cash": int(round(cash))
      })

    # Runway calculations
    net_monthly_burn = burn_rate - (50.0 * monthly_arpu)
    if net_monthly_burn <= 0:
      runway = 999 # Self-sustaining revenue
    else:
      runway = int(round(initial_capital / net_monthly_burn))
      runway = max(runway, 0)

    return {
      "projections": projections,
      "runway": runway,
      "break_even_month": next((p["month"] for p in projections if p["revenue"] > p["costs"]), -1)
    }

  def match_cofounders(self, user_skills: List[str], candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not user_skills or not candidates:
      return []

    # Map skills into a vector index
    all_skills = list(set(user_skills + [s for c in candidates for s in c.get("skills", [])]))
    
    def vectorize(skills):
      return [1 if s in skills else 0 for s in all_skills]

    user_vec = np.array(vectorize(user_skills)).reshape(1, -1)
    results = []

    for candidate in candidates:
      cand_vec = np.array(vectorize(candidate.get("skills", []))).reshape(1, -1)
      # Cosine similarity matching
      similarity = float(cosine_similarity(user_vec, cand_vec)[0][0])
      
      # Modify compatibility score with random factor
      score = int(round(similarity * 100))
      results.append({
        "candidate_id": candidate.get("id"),
        "compatibility_score": min(score + 10, 100), # base boost
        "matched_skills": list(set(user_skills).intersection(set(candidate.get("skills", []))))
      })

    return sorted(results, key=lambda x: x["compatibility_score"], reverse=True)

  def recommend_investors(self, industry: str, stage: str, funding_needed: float) -> List[Dict[str, Any]]:
    matches = []
    
    for inv in self.investors_db:
      score = 50
      
      # Check sector match
      if industry.lower() in inv["industries"]:
        score += 30
      
      # Check stage matches
      if stage.lower() == inv["stage"].lower():
        score += 15
      
      # Check investment ranges
      if inv["min_check"] <= funding_needed <= inv["max_check"]:
        score += 5

      matches.append({
        "name": inv["name"],
        "match_score": min(score, 100),
        "min_check": inv["min_check"],
        "max_check": inv["max_check"]
      })

    return sorted(matches, key=lambda x: x["match_score"], reverse=True)
