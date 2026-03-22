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

Click ✅ **Deploy**

---

## 🧩 STEP 4: Create Lambda → getAssessments

### 🔹 Same Steps:
- Name: getAssessments
- Runtime: Node.js 20.x
- Role: lambda-dynamodb-role

### 🔹 Add Code

```javascript
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });

export const handler = async (event) => {
  try {
    console.log("EVENT:", JSON.stringify(event));

    const userId = event.pathParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "userId is required" })
      };
    }

    const params = {
      TableName: "SwasthyaSetu_Assessments",
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: {
        ":uid": { S: userId }
      },
      ScanIndexForward: false
    };

    const data = await client.send(new QueryCommand(params));

    const items = (data.Items || []).map(item => ({
      userId: item.userId.S,
      timestamp: item.timestamp.S,
      features: JSON.parse(item.features.S),
      prediction: item.prediction.S,
      probability: Number(item.probability.N),
      riskLevel: item.riskLevel.S
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(items)
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

Click ✅ **Deploy**

---

## 🧩 STEP 5: Create API Gateway (HTTP API)

### 🔹 Go to:
AWS API Gateway → Create API

### 🔹 Select:
- **HTTP API** (IMPORTANT)

Click → **Build**

---

## 🧩 STEP 6: Add Integrations

Add both Lambdas under Integrations:
- `getAssessments`
- `saveAssessment`

---

## 🧩 STEP 7: Create Routes

### 🔹 Route 1: GET assessments
- Method: `GET`
- Path: `/assessments/{userId}`
- Integration: `getAssessments`

### 🔹 Route 2: POST save assessment
- Method: `POST`
- Path: `/save-assessment`
- Integration: `saveAssessment`

---

## 🧩 STEP 8: Deploy API
- Click **Deploy**
- Stage: `default`

---

## 🧩 STEP 9: Get API URL

Example:
`https://xxxxx.execute-api.ap-south-1.amazonaws.com`

---

## 🧪 STEP 10: Test APIs

### 🔹 POST → Save Assessment

`POST /save-assessment`

**Body:**
```json
{
  "userId": "user123",
  "features": {"age": 65},
  "prediction": "Positive",
  "probability": 0.87,
  "riskLevel": "High"
}
```

### 🔹 GET → Fetch Assessments

`GET /assessments/user123`

✔️ **Returns:**
- All assessments
- Latest first