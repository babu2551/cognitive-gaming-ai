from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "cognitive_assessment_model.pkl"

FEATURE_COLUMNS = [
    "Age",
    "Education_Years",
    "Memory_Score",
    "Attention_Score",
    "Reaction_Time_ms",
    "Orientation_Score",
    "Daily_Activity_Score",
]


# Load trained Pipeline
try:
    model = joblib.load(MODEL_PATH)
except (FileNotFoundError, OSError, ValueError) as exc:
    raise RuntimeError(
        "Could not load cognitive_assessment_model.pkl"
    ) from exc


app = FastAPI(
    title="Cognitive Assessment API",
    description="AI-based cognitive risk classification system",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class CognitiveAssessment(BaseModel):

    age: float = Field(
        ...,
        ge=0,
        le=120,
        alias="Age"
    )

    education_years: float = Field(
        ...,
        ge=0,
        le=30,
        alias="Education_Years"
    )

    memory_score: float = Field(
        ...,
        ge=0,
        le=100,
        alias="Memory_Score"
    )

    attention_score: float = Field(
        ...,
        ge=0,
        le=100,
        alias="Attention_Score"
    )

    reaction_time_ms: float = Field(
        ...,
        ge=0,
        le=10000,
        alias="Reaction_Time_ms"
    )

    orientation_score: float = Field(
        ...,
        ge=0,
        le=100,
        alias="Orientation_Score"
    )

    daily_activity_score: float = Field(
        ...,
        ge=0,
        le=100,
        alias="Daily_Activity_Score"
    )

    model_config = {
        "populate_by_name": True
    }


class PredictionResponse(BaseModel):
    prediction: int
    risk: str
    probability: float


@app.get("/")
def home():

    return {
        "message": "Cognitive Assessment API",
        "status": "running",
        "model": "Logistic Regression",
        "endpoint": "/predict"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model": "loaded"
    }


@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(assessment: CognitiveAssessment):

    try:

        # Convert input to dictionary
        values = assessment.model_dump(
            by_alias=True
        )

        # Create DataFrame
        features = pd.DataFrame(
            [values],
            columns=FEATURE_COLUMNS
        )

        # Pipeline automatically performs:
        # Scaling + Logistic Regression
        prediction = int(
            model.predict(features)[0]
        )

        # Get probabilities
        probabilities = model.predict_proba(
            features
        )[0]

        probability = float(
            probabilities[1]
        )

        # Risk classification
        if prediction == 1:
            risk = "high"
        else:
            risk = "low"

        return PredictionResponse(
            prediction=prediction,
            risk=risk,
            probability=round(
                probability,
                4
            )
        )

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=f"Prediction failed: {str(exc)}"
        ) from exc