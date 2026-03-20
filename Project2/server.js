const express = require("express");
const path = require("path");

const app = express();
const BASE_PORT = Number(process.env.PORT) || 3000;

function parseCookies(cookieHeader = "") {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce((acc, pair) => {
    const [rawKey, ...rawValue] = pair.split("=");
    const key = (rawKey || "").trim();
    if (!key) {
      return acc;
    }

    const value = rawValue.join("=").trim();
    acc[key] = decodeURIComponent(value || "");
    return acc;
  }, {});
} 

// function requireAuth(req, res, next) {
//   const cookies = parseCookies(req.headers.cookie);

//   if (!cookies.idToken) {
//     res.redirect("/login");
//     return;
//   }

//   next();
// }


// ── Serve static files (CSS, JS) from the /public folder ──
app.use(express.static(path.join(__dirname, "public")));

// ── Routes ────────────────────────────────────────────────

// Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// About Page (protected)
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Login Page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Register Page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

// Verify Page 
app.get("/verify", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "verify.html"));
});

// ── Start the server ───
function startServer(port) {
  const server = app.listen(port, () => {
    console.log("");
    console.log("👻 Haunted Cloud App is ALIVE!");
    console.log(`🌐 Open your browser: http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.log(`Port ${port} is busy. Trying ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error("Server failed to start:", err);
    process.exit(1);
  });
}

startServer(BASE_PORT);
