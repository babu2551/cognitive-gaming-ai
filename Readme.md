# 🧠 AI Cognitive Care Platform

> **AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients**

An AI-powered platform designed to support **cognitive assessment, memory assistance, and cognitive stimulation** for elderly users experiencing dementia-related challenges.

The system combines **Machine Learning, Python, FastAPI, and interactive cognitive games** to provide a technology-driven approach for monitoring cognitive performance and supporting memory-related activities.

---

## 🎯 Problem Statement

Dementia and other cognitive disorders can affect memory, attention, orientation, reaction time, and other cognitive abilities.

The goal of this project is to develop an accessible platform that can:

* 🧠 Assess cognitive performance using Machine Learning
* 📊 Analyze cognitive assessment data
* 🎮 Provide interactive cognitive games
* 💾 Maintain user assessment history
* 📈 Track cognitive performance over time
* 🚨 Identify users who may require further professional assessment

> **Note:** This system is intended as a supportive/educational tool and is **not a replacement for professional medical diagnosis**.

---

## 🚀 Key Features

### 🧠 Cognitive Assessment

Collects assessment features such as:

* Age
* Education Years
* Memory Score
* Attention Score
* Reaction Time
* Orientation Score

### 🤖 Machine Learning Prediction

A classification model analyzes cognitive-assessment data and predicts the corresponding cognitive-risk category.

### ⚡ FastAPI Backend

FastAPI is used to create REST APIs for:

* Sending assessment data
* Running ML predictions
* Returning prediction results
* Connecting the ML model with the frontend

### 🎮 Cognitive Games

The planned platform includes games designed to stimulate:

* Memory
* Attention
* Concentration
* Pattern recognition
* Reaction speed
* Problem-solving

### 📊 Performance Tracking

Users can monitor changes in their cognitive-game and assessment performance over time.

---

## 🏗️ System Architecture

```text
                 ┌──────────────────────┐
                 │      User / Patient  │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Web Application    │
                 │ Assessment + Games   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │      FastAPI         │
                 │      Backend         │
                 └──────────┬───────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
       ┌─────────────────┐     ┌─────────────────┐
       │ ML Prediction   │     │ User/Assessment │
       │ Model           │     │ Data            │
       └────────┬────────┘     └─────────────────┘
                │
                ▼
       ┌─────────────────┐
       │ Prediction      │
       │ Result          │
       └─────────────────┘
```

---

## 🛠️ Technology Stack

| Technology              | Purpose                    |
| ----------------------- | -------------------------- |
| 🐍 Python               | Machine Learning & Backend |
| 🤖 Scikit-learn         | ML Model                   |
| ⚡ FastAPI               | REST API                   |
| 📦 Joblib               | Model Serialization        |
| 🐼 Pandas               | Data Processing            |
| 🔢 NumPy                | Numerical Computing        |
| 📊 Matplotlib / Seaborn | Data Visualization         |
| 🌐 HTML/CSS/JS or React | Frontend                   |
| 🎮 JavaScript           | Cognitive Games            |

---

## 📁 Project Structure

```text
cognitive-care-ai/
│
├── dataset/
│   └── cognitive_assessment.csv
│
├── model/
│   └── cognitive_model.joblib
│
├── notebooks/
│   ├── EDA.ipynb
│   └── model_training.ipynb
│
├── api/
│   └── main.py
│
├── frontend/
│   └── ...
│
├── games/
│   └── ...
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

## 🧪 Machine Learning Workflow

```text
Dataset
   ↓
Data Cleaning
   ↓
Exploratory Data Analysis
   ↓
Feature Selection
   ↓
Train-Test Split
   ↓
Feature Scaling
   ↓
Model Training
   ↓
Model Evaluation
   ↓
Save Model using Joblib
   ↓
Integrate with FastAPI
```

---

## 🤖 ML Model

The initial version uses a **classification approach** because the objective is to categorize cognitive assessment results into predefined classes.

The model can be evaluated using:

* Accuracy
* Precision
* Recall
* F1-Score
* Confusion Matrix

Different classification algorithms can be compared, such as:

* Logistic Regression
* Decision Tree
* Random Forest
* K-Nearest Neighbors
* Support Vector Machine

The best-performing model can then be saved and integrated into the FastAPI backend.

---

## ⚡ Running the Project

### 1. Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/cognitive-care-ai.git
cd cognitive-care-ai
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

Activate it:

**Windows**

```bash
venv\Scripts\activate
```

**macOS/Linux**

```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run FastAPI

```bash
uvicorn api.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 📡 Example API Request

```json
{
  "Age": 68,
  "Education_Years": 12,
  "Memory_Score": 72,
  "Attention_Score": 68,
  "Reaction_Time_ms": 520,
  "Orientation_Score": 75
}
```

### Example Response

```json
{
  "prediction": "Low Risk",
  "confidence": 0.89
}
```

*Example response only; actual output depends on the trained model.*

---

## 🔮 Future Scope

* 🎮 More personalized cognitive games
* 🧠 AI-based adaptive difficulty
* 📊 Long-term cognitive performance dashboard
* 👨‍👩‍👧 Caregiver dashboard
* 🔐 Secure user authentication
* ☁️ Cloud deployment
* 📱 Mobile application
* 🌐 Regional language support
* 📈 Personalized cognitive improvement recommendations

---

## 🎯 Project Goals

The long-term goal is to build a **user-friendly AI platform** that combines cognitive assessment and engaging games to support elderly users and caregivers.

The platform focuses on **early awareness, cognitive stimulation, and performance tracking**, rather than medical diagnosis.

---

## 👨‍💻 Development Team

Developed as an academic/hackathon project focused on:

**Artificial Intelligence • Machine Learning • Healthcare Technology • Cognitive Computing**

---

## 📜 Disclaimer

This project is developed for **educational, research, and prototype purposes**.

The predictions generated by the system should **not be considered a medical diagnosis**. Users should consult qualified healthcare professionals for clinical evaluation and treatment decisions.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
