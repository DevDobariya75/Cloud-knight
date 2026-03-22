# 🔐 Cognito Setup Guide

This guide will help you set up **AWS Cognito User Pool** and connect it with this project for authentication (Signup, Login, Logout).

---

## 🚀 Step 1: Create Cognito User Pool

1. Go to **AWS Console**
2. Search for **Cognito**
3. Click on **Create user pool**

---

## ⚙️ Step 2: Configure Application

### Application Type
- Select: **Single-page application (SPA)**

### Application Name
- Enter any name (example: `my-project-auth`)

---

## 🔑 Step 3: Configure Sign-in Options

### Sign-in identifiers
- Select: **Email**

---

## 📝 Step 4: Required Attributes

### Required attributes for sign-up
- Select: **Email**

---

## 🔗 Step 5: Return URL

- Leave this field **empty**

---

## ✅ Step 6: Create User Pool

- Click **Create user directory**

---

## 📌 Step 7: Get Required Credentials

After the user pool is created:

### Get User Pool ID
- Go to **User Pool Dashboard**
- Copy the **User Pool ID**

### Get App Client ID
- Go to:
  App clients → Your App
- Copy the **App Client ID**

---

## 🧩 Step 8: Configure Project

Open the file:
src/services/cognitoConfig.js


Update the configuration:

```javascript
const cognitoConfig = {
  UserPoolId: "YOUR_USER_POOL_ID",
  ClientId: "YOUR_APP_CLIENT_ID",
};

export default cognitoConfig;
``` 

Now you are ready with Authentication Feature.