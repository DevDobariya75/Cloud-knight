import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/cognitoAuth";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await registerUser(email, password);
      alert("Verification code sent to your email.");
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      alert(error.message || "Registration failed.");
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <form onSubmit={handleRegister} className="space-y-4 rounded-xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">Register</h2>
        <input name="email" placeholder="Email" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <input name="password" type="password" placeholder="Password" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <button type="submit" className="w-full rounded-lg bg-blue-700 px-3 py-2 font-semibold text-white">Register</button>
      </form>
    </main>
  );
}