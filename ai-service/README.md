# PlasticLoop AI Plastic Classification Service (Architecture & Integration Plan)

This directory contains the planned architecture for an autonomous Python / FastAPI microservice for AI-powered plastic resin code image classification.

---

## 🏗️ Microservice Architecture

```
User Uploads Waste Photo
       ↓
Express REST API (/api/upload)
       ↓
FastAPI AI Service (/predict)
       ↓
ResNet-50 / EfficientNet PyTorch Model
       ↓
Returns Json: { "material": "PET", "confidence": 0.96, "recyclable": true }
```

---

## 📄 Proposed FastAPI Endpoint Specification

### `POST /predict`
- **Payload**: Image Multipart File (`file`)
- **Response**:
```json
{
  "material": "PET",
  "confidence": 0.96,
  "recyclable": true,
  "pointsPerKg": 10,
  "description": "Clear beverage bottle detected. High commercial recycling yield."
}
```

---

## 🛡️ Resilience & Non-Blocking Design
- The AI plastic scanner component in the PlasticLoop React frontend operates as an optional assistant modal.
- If the AI service is unavailable or offline, the core MERN application continues to function smoothly using manual category selection.
