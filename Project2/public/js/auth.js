let cognitoReadyPromise;

function setAuthCookie(token) {
  const maxAgeSeconds = 60 * 60;
  document.cookie = `idToken=${encodeURIComponent(token)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
}

function clearAuthCookie() {
  document.cookie = "idToken=; Max-Age=0; Path=/; SameSite=Lax";
}

function showAuthMessage(message, error = false) {
  if (error) {
    console.error(message);
    alert(message);
  } else {
    console.log(message);
    alert(message);
  }
}

/* ═══════════════════════════════════════════════════════════
   ✨ BUTTON LOADING STATE MANAGEMENT
   ═══════════════════════════════════════════════════════════ */

function setButtonLoading(button, isLoading = true) {
  if (isLoading) {
    button.classList.add("loading");
    button.disabled = true;
  } else {
    button.classList.remove("loading");
    button.disabled = false;
  }
}

function getFormButton(form) {
  return form.querySelector('button[type="submit"]');
}

function formatAuthError(err, fallbackMessage) {
  const rawMessage = (err && err.message ? err.message : "").toLowerCase();

  if (rawMessage.includes("secret_hash") || rawMessage.includes("configured with secret")) {
    return "Cognito App Client is configured with a client secret. For browser apps, create/use an App Client WITHOUT client secret, then update ClientId in public/js/cognito-config.js.";
  }

  return (err && err.message) || fallbackMessage;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/* ═══════════════════════════════════════════════════════════
    ✨ COGNITO INITIALIZATION & AUTH LOGIC
    ═══════════════════════════════════════════════════════════ */

async function ensureCognitoReady() {
  // write here
}

function getEmailFromPageOrQuery() {
  // write here
}

function handleLogin(event) {
  // write here
}

function handleRegister(event) {
  // write here
}

function handleVerifyOtp(event) {
  // write here
}

function logout() {
  // write here
}

window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleVerifyOtp = handleVerifyOtp;
window.logout = logout;
window.setButtonLoading = setButtonLoading;
