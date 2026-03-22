import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmUser, resendConfirmationCode } from "../services/cognitoAuth";

export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const handleVerify = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const code = e.target.code.value.trim();

    try {
      await confirmUser(email, code);
      alert("Account verified successfully. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.message || "Verification failed.");
    }
  };

  const handleResendCode = async (e) => {
    const form = e.currentTarget.form;
    const email = form?.email?.value?.trim();

    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      await resendConfirmationCode(email);
      alert("A new verification code has been sent.");
    } catch (error) {
      alert(error.message || "Could not resend code.");
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <form onSubmit={handleVerify} className="space-y-4 rounded-xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">Verify Email</h2>
        <p className="text-sm text-slate-600">Enter the verification code sent to your email.</p>

        <input
          name="email"
          type="email"
          defaultValue={initialEmail}
          placeholder="Email"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />

        <input
          name="code"
          placeholder="6-digit code"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />

        <button type="submit" className="w-full rounded-lg bg-blue-700 px-3 py-2 font-semibold text-white">
          Verify Account
        </button>

        <button
          type="button"
          onClick={handleResendCode}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700"
        >
          Resend Code
        </button>
      </form>
    </main>
  );
}
