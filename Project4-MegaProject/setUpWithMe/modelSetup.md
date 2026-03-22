# 🗄️ DynamoDB + Lambda + API Gateway Setup Guide

This guide explains how to set up the backend for storing and retrieving assessments using:

- DynamoDB (Database)
- AWS Lambda (Backend Logic)
- API Gateway (API Layer)

---

## 🧠 Architecture Overview

DynamoDB ← Lambda ← API Gateway ← Frontend

---

## 🧩 STEP 1: Create DynamoDB Table

### 🔹 Go to:
AWS Console → DynamoDB → Create Table

### 🔹 Fill Details:

- **Table Name:** SwasthyaSetu_Assessments
- **Partition Key (PK):**
  - userId → Type: String
- **Sort Key (SK):**
  - timestamp → Type: String

### 🔹 Table Settings:
- Keep all settings **default**

Click ✅ **Create Table**

---

## ⚠️ IMPORTANT

Your query uses:

KeyConditionExpression: "userId = :uid"

✔️ This will ONLY work if:

- userId = Partition Key  
- timestamp = Sort Key  

👉 Make sure this is configured correctly.

---

## 🧩 STEP 2: Create IAM Role for Lambda

### 🔹 Go to:
IAM → Roles → Create Role

### 🔹 Select:
- Trusted Entity: AWS Service  
- Use Case: Lambda  

### 🔹 Attach Policies:
- AmazonDynamoDBFullAccess  
- AWSLambdaBasicExecutionRole  

### 🔹 Role Name:
lambda-dynamodb-role

Click ✅ **Create Role**

---

## 🧩 STEP 3: Create Lambda → saveAssessment

### 🔹 Go to:
AWS Lambda → Create Function

### 🔹 Settings:
- Name: saveAssessment  
- Runtime: Node.js 20.x or higher  
- Role: Use existing role → lambda-dynamodb-role  

Click ✅ **Create Function**

---

### 🔹 Add Code (Replace everything)

```javascript
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });

export const handler = async (event) => {
  try {
    console.log("EVENT:", JSON.stringify(event));

    const body = event.body ? JSON.parse(event.body) : {};

    const {
      userId,
      features,
      prediction,
      probability,
      riskLevel
    } = body;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "userId is required" })
      };
    }

    const timestamp = new Date().toISOString();

    const params = {
      TableName: "SwasthyaSetu_Assessments",
      Item: {
        userId: { S: userId },
        timestamp: { S: timestamp },
        features: { S: JSON.stringify(features) },
        prediction: { S: prediction || "UNKNOWN" },
        probability: { N: String(probability ?? 0) },
        riskLevel: { S: riskLevel || "UNKNOWN" }
      }
    };

    await client.send(new PutItemCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Assessment saved successfully",
        timestamp
      })
    };

  } catch (error) {
    console.error("ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message
      })
    };
  }
};
```

## 🟢 PHASE 1: AWS Setup

### ☁️ Install AWS CLI
Go to: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
Download & Install

Verify:
```bash
aws --version
```

### 🔹 Step 2: Create AWS Access Keys
1. Go to AWS Console
2. Search → IAM
3. Click Users
4. Select your username
5. Go to Security Credentials
6. Click Create Access Key
7. Select: CLI usage

Copy:
- Access Key
- Secret Key

### 🔹 Step 3: Configure AWS CLI

Run:
```bash
aws configure
```

Enter:
- Access Key: `YOUR_ACCESS_KEY`
- Secret Key: `YOUR_SECRET_KEY`
- Region: `ap-south-1`
- Output: `json`

## 🟢 PHASE 2: Project Setup
### 🔹 Step 4: Create Project Folder
```bash
mkdir alzheimer-project
cd alzheimer-project
```

### 🔹 Step 5: Add Required Files

Place these files inside the folder:

| File | Purpose |
|------|---------|
| `app.py` | Lambda logic |
| `model.json` | ML model |
| `requirements.txt` | Python libraries |
| `Dockerfile` | Container setup |

👉 All files must be in the same directory

## 🟢 PHASE 3: Docker Setup (VERY IMPORTANT)
### 🔹 Step 6: Build Docker Image
```bash
docker build -t alzheimer-model .
```
What happens:
- Installs Python
- Installs dependencies
- Copies model
- Prepares Lambda environment

⏳ Takes ~2–5 minutes

### 🔹 Step 7: Verify Image
```bash
docker images
```

You should see:
```text
alzheimer-model
```

### 🔹 Step 8: Run Container Locally
```bash
docker run -p 9000:8080 alzheimer-model
```

### 🔹 Step 9: Test Locally

Open new terminal:
```bash
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
-d '{"features":[65,1,0,2,24.5,0,1,2,3,4,1,0,1,0,0,1,120,80,200,120,50,150,25,2,1,0,1,0,1,0,1,1,0]}'
```

✅ If response comes → setup is correct

## 🟢 PHASE 4: AWS ECR (Docker Image Storage)
### 🔹 Step 10: Open AWS Console

Go to: [https://console.aws.amazon.com/](https://console.aws.amazon.com/)
Search: `ECR`

### 🔹 Step 11: Create Repository
1. Click Create Repository
2. Select: Private
3. Name: `alzheimer-detection`
4. Click Create

### 🔹 Step 12: Copy Repository URI

Example:
`123456789012.dkr.ecr.ap-south-1.amazonaws.com/alzheimer-detection`

👉 Save this (VERY IMPORTANT)

### 🔹 Step 13: Login Docker to AWS
```bash
aws ecr get-login-password --region ap-south-1 \
| docker login --username AWS --password-stdin YOUR_URI
```

### 🔹 Step 14: Tag Image
```bash
docker tag alzheimer-model:latest YOUR_URI
```

### 🔹 Step 15: Push Image
```bash
docker push YOUR_URI
```

⏳ Takes 2–5 minutes

## 🟢 PHASE 5: AWS Lambda (Serverless Execution)
### 🔹 Step 16: Go to Lambda

Search: `Lambda`

### 🔹 Step 17: Create Function
1. Click Create Function
2. Select: Container Image
3. Name: `alzheimer-api`
4. Paste ECR Image URI
5. Click Create

### 🔹 Step 18: Configure Lambda

Go to:
Configuration → General Settings

Set:
- Memory: `1024 MB`
- Timeout: `15 seconds`

Click Save

### 🔹 Step 19: Deploy

Click: Deploy

## 🟢 PHASE 6: API Gateway (Public API)
### 🔹 Step 20: Open API Gateway

Search: `API Gateway`

### 🔹 Step 21: Create API
1. Click Create API
2. Choose: HTTP API
3. Click Build

### 🔹 Step 22: Add Integration
1. Select: Lambda
2. Choose: `alzheimer-api`

### 🔹 Step 23: Configure Route
- Method: `POST`
- Path: `/predict`

### 🔹 Step 24: Deploy API

Click: Deploy

### 🔹 Step 25: Copy API URL

Example:
`https://abc123.execute-api.ap-south-1.amazonaws.com/predict`

## 🟢 PHASE 7: Final Testing 🎉
### 🔹 Step 26: Test API
```bash
curl -X POST https://your-api-url \
-H "Content-Type: application/json" \
-d '{"features":[65,1,0,2,24.5,0,1,2,3,4,1,0,1,0,0,1,120,80,200,120,50,150,25,2,1,0,1,0,1,0,1,1,0]}'
```

### 🔹 Step 27: Expected Output
```json
{
  "prediction": 1,
  "probability": 0.85,
  "result": "Alzheimer's Detected"
}
```