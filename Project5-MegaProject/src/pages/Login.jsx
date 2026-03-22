import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/cognitoAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await loginUser(email, password);
      const token = response?.AuthenticationResult?.IdToken;

      if (!token) {
        alert("Login succeeded but token is missing.");
        return;
      }

      // Store idToken for API interceptor
      localStorage.setItem('idToken', token);
      
      login(token, { email });
      navigate("/");
    } catch (error) {
      if (error.message?.includes("UserNotConfirmedException")) {
        alert("Your account is not verified yet. Please complete verification.");
        navigate(`/verify?email=${encodeURIComponent(email)}`);
        return;
      }

      alert(error.message || "Login failed.");
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <form onSubmit={handleLogin} className="space-y-4 rounded-xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
        <input name="email" required placeholder="Email" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <input name="password" type="password" required placeholder="Password" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <button className="w-full rounded-lg bg-blue-700 px-3 py-2 font-semibold text-white">Login</button>
      </form>
    </main>
  );
}