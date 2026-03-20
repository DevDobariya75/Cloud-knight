
// Main JavaScript for handling authentication state and UI updates
document.addEventListener("DOMContentLoaded", () => {
  // Update navigation based on authentication status
  const isLoggedIn = localStorage.getItem("idToken") !== null;
  const navLinks = document.querySelector(".nav-links");
  
  if (isLoggedIn && navLinks) {

    // Remove login and register links
    const loginLink = Array.from(navLinks.querySelectorAll("a")).find(a => a.getAttribute("href") === "/login");
    const registerLink = Array.from(navLinks.querySelectorAll("a")).find(a => a.getAttribute("href") === "/register");
    
    if (loginLink) loginLink.parentElement.remove();
    if (registerLink) registerLink.parentElement.remove();
    
    // Add logout link
    const logoutItem = document.createElement("li");
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.textContent = "Logout";
    logoutLink.onclick = (e) => {
      e.preventDefault();
      window.logout();
    };
    logoutItem.appendChild(logoutLink);
    navLinks.appendChild(logoutItem);
  }

  // Highlight current page in navigation
  const links = document.querySelectorAll(".nav-links a");
  links.forEach(link => {
    if (link.getAttribute("href") === window.location.pathname) {
      link.style.color = "var(--purple-light)";
      link.style.background = "rgba(124, 58, 237, 0.15)";
      link.style.borderColor = "var(--border)";
    }
  });

  /* ═══════════════════════════════════════════════════════════
     ✨ PAGE FADE-IN ANIMATION
     ═══════════════════════════════════════════════════════════ */
  
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.style.animation = "fadeIn 0.8s ease-out";
  });
});

