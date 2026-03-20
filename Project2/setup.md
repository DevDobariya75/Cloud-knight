# AWS Cognito Authentication Setup

## Cognito Connectivity Setup

Ensures that the Cognito configuration and AWS SDK are loaded before attempting authentication.

```javascript
async function ensureCognitoReady() {
  if (!cognitoReadyPromise) {
    cognitoReadyPromise = (async () => {
      if (typeof window.poolData === "undefined") {
        try {
          await loadScript("/js/cognito-config.js");
        } catch (err) {
          console.warn("Could not load /js/cognito-config.js. Falling back to default auth config.", err);
        }
      }

      if (typeof window.AmazonCognitoIdentity === "undefined") {
        await loadScript("https://cdn.jsdelivr.net/npm/amazon-cognito-identity-js@6.3.16/dist/amazon-cognito-identity.min.js");
      }

      if (!window.userPool) {
        if (!window.poolData) {
          throw new Error("Cognito configuration not found. Ensure cognito-config.js is loaded BEFORE auth.js in your HTML.");
        }
        window.userPool = new window.AmazonCognitoIdentity.CognitoUserPool(window.poolData);
      }
    })();
  }

  return cognitoReadyPromise;
}
```

## Query Setting Up

Retrieves email from form input or URL query parameters. **Normalizes email to lowercase to ensure consistency with AWS Cognito.**

```javascript
function getEmailFromPageOrQuery() {
  const emailInput = document.getElementById("email");

  if (emailInput && emailInput.value && emailInput.value.trim()) {
    return emailInput.value.trim().toLowerCase();
  }

  const params = new URLSearchParams(window.location.search);
  return (params.get("email") || "").trim().toLowerCase();
}
```

## Login Handler

Handles user login with AWS Cognito authentication. **Email is normalized to lowercase to prevent case-sensitivity issues.**

```javascript
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const form = event.target;
  const btn = getFormButton(form);

  setButtonLoading(btn, true);
  alert("Unlocking the haunted vault...");

  ensureCognitoReady()
    .then(() => {
      const authDetails = new window.AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const cognitoUser = new window.AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: window.userPool,
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          const idToken = result.getIdToken().getJwtToken();
          localStorage.setItem("idToken", idToken);
          localStorage.setItem("accessToken", result.getAccessToken().getJwtToken());
          localStorage.setItem("refreshToken", result.getRefreshToken().getToken());
          localStorage.setItem("userEmail", email);
          setAuthCookie(idToken);
          alert("Welcome back to the haunted cloud!");
          window.location.assign("/about");
        },
        onFailure: (err) => {
          setButtonLoading(btn, false);
          if (err && err.code === "UserNotConfirmedException") {
            alert("Account not verified yet. Redirecting to OTP verification...");
            window.location.assign(`/verify?email=${encodeURIComponent(email)}`);
            return;
          }

          showAuthMessage(formatAuthError(err, "Login failed. Protect me… hackers are watching 😱"), true);
        },
      });
    })
    .catch((err) => {
      setButtonLoading(btn, false);
      showAuthMessage(formatAuthError(err, "Cognito initialization failed."), true);
    });
}
```

## Register Handler

Handles user registration with AWS Cognito. **Email is normalized to lowercase to ensure consistent account creation.**

```javascript
function handleRegister(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const form = event.target;
  const btn = getFormButton(form);

  setButtonLoading(btn, true);
  alert("Creating your haunted account...");

  ensureCognitoReady()
    .then(() => {
      const attributeList = [
        new window.AmazonCognitoIdentity.CognitoUserAttribute({
          Name: "email",
          Value: email,
        }),
      ];

      window.userPool.signUp(email, password, attributeList, null, (err) => {
        setButtonLoading(btn, false);
        if (err) {
          showAuthMessage(formatAuthError(err, "Registration failed. Protect me… hackers are watching 😱"), true);
          return;
        }

        alert("Account created! Check your email for OTP verification.");
        window.location.assign(`/verify?email=${encodeURIComponent(email)}`);
      });
    })
    .catch((err) => {
      setButtonLoading(btn, false);
      showAuthMessage(formatAuthError(err, "Cognito initialization failed."), true);
    });
}
```

## otp handler

```javascript
function handleVerifyOtp(event) {
  event.preventDefault();

  const email = getEmailFromPageOrQuery();
  const code = document.getElementById("otpCode").value.trim();
  const form = event.target;
  const btn = getFormButton(form);

  if (!email) {
    showAuthMessage("Email not found. Open verify page from register or include ?email=your@email.com in URL.", true);
    return;
  }

  setButtonLoading(btn, true);
  alert("Verifying your magical code...");

  ensureCognitoReady()
    .then(() => {
      const cognitoUser = new window.AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: window.userPool,
      });

      cognitoUser.confirmRegistration(code, true, (err) => {
        setButtonLoading(btn, false);
        if (err) {
          showAuthMessage(formatAuthError(err, "Verification failed."), true);
          return;
        }

        alert("Account verified! Welcome to the haunted cloud.");
        window.location.assign("/login");
      });
    })
    .catch((err) => {
      setButtonLoading(btn, false);
      showAuthMessage(formatAuthError(err, "Cognito initialization failed."), true);
    });
}
```

## logout functionality

```javascript

function logout() {
  ensureCognitoReady()
    .then(() => {
      const currentUser = window.userPool.getCurrentUser();
      if (currentUser) {
        currentUser.signOut();
      }

      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      clearAuthCookie();
      alert("The haunting ends here...");
      window.location.assign("/login");
    })
    .catch(() => {
      localStorage.clear();
      clearAuthCookie();
      window.location.assign("/login");
    });
}
```
