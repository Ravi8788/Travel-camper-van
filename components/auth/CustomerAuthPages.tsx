"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Compass, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, ButtonLink, Card, CardContent, Container, FormField, Input } from "@/components/ui";
import { PageContent } from "@/components/layout/PageBanner";
import { createClient } from "@/utils/supabase/client";

const DEMO_CUSTOMER_EMAIL = "customer@gmail.com";
const DEMO_CUSTOMER_PASSWORD = "Customer@123";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  variant: "customer" | "admin";
};

function AuthShell({ eyebrow, title, subtitle, children, variant }: AuthShellProps) {
  const isAdmin = variant === "admin";

  return (
    <PageContent className={`${isAdmin ? "auth-admin-page" : "auth-customer-page"} h-screen overflow-hidden px-0 py-3 sm:py-5`}>
      <Container className="h-full">
        <div className="mb-3 flex justify-end">
          <ButtonLink href="/" variant="outline" size="sm" className="h-9 px-3 text-xs font-semibold">
            View site
          </ButtonLink>
        </div>
        <Card className={`auth-shell mx-auto grid h-[calc(100vh-7rem)] max-w-5xl overflow-hidden border-0 shadow-elevated lg:grid-cols-[0.9fr_1.1fr] ${isAdmin ? "bg-slate-950" : "bg-sand-50"}`} padding="none">
          <div className="auth-visual relative hidden h-full min-h-[560px] overflow-hidden p-8 text-white lg:flex lg:flex-col lg:justify-between sm:p-10">
            <div className="auth-grid absolute inset-0 opacity-30" />
            <div className="auth-orbit absolute -right-24 top-20 h-80 w-80 rounded-full border border-accent-300/40" />
            <div className="auth-orbit auth-orbit-delay absolute -bottom-32 -left-28 h-96 w-96 rounded-full border-[18px] border-white/10" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500 text-white"><Compass className="h-5 w-5" /></span> Travel On Wheels</div>
              <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">{isAdmin ? "Control room" : "Go further"}</span>
            </div>
            <div className="relative z-10 max-w-sm">
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent-300"><Sparkles className="h-4 w-4" /> {eyebrow}</p>
              <p className="font-display text-5xl font-bold leading-[0.92] tracking-tight xl:text-6xl">Make room for the good kind of lost.</p>
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/65">{isAdmin ? "One calm place for the people, vehicles, and trips that keep the road moving." : "Your next Maharashtra escape starts with a van, a route, and a little more freedom."}</p>
            </div>
            <div className="relative z-10 flex items-center gap-3 text-xs text-white/60"><span className="h-2 w-2 rounded-full bg-accent-400" /> Mahabaleshwar · Panchgani · Tapola</div>
          </div>
          <div className="bg-sand-50 p-6 sm:p-10 lg:p-14">
            <div className="mb-8 lg:hidden"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-600"><Compass className="h-4 w-4" /> Travel On Wheels</p></div>
            <p className={`eyebrow ${isAdmin ? "text-slate-500" : ""}`}>{isAdmin ? "Operations workspace" : eyebrow}</p>
            <h1 className="mt-3 max-w-md font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-sand-500">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </Card>
      </Container>
    </PageContent>
  );
}

export function CustomerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nextPath = searchParams.get("next") ?? "/account";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    setLoading(false);
    if (loginError) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const signInResult = await supabase.auth.signInWithPassword({ email: DEMO_CUSTOMER_EMAIL, password: DEMO_CUSTOMER_PASSWORD });
    if (signInResult.error) {
      const signUp = await supabase.auth.signUp({
        email: DEMO_CUSTOMER_EMAIL,
        password: DEMO_CUSTOMER_PASSWORD,
        options: { data: { full_name: "Demo Customer", phone: "9999999999", role: "customer" } },
      });
      if (!signUp.error && signUp.data?.session) {
        setLoading(false);
        router.push(nextPath);
        router.refresh();
        return;
      } else if (!signUp.error) {
        setLoading(false);
        setError("Demo account created. Disable email confirmation in Supabase or verify the demo email before signing in.");
        return;
      }
      if (signUp.error.message.toLowerCase().includes("already")) {
        setLoading(false);
        setError("customer@gmail.com already exists in Supabase with a different password. Reset that account password or create this demo user in Supabase Auth with password Customer@123.");
        return;
      }
    }
    setLoading(false);
    if (signInResult.error) {
      setError(`Demo login failed: ${signInResult.error.message}`);
      return;
    }
    router.push(nextPath);
    router.refresh();
  };

  return (
    <AuthShell
      eyebrow="Travel On Wheels"
      title="Welcome back"
      subtitle="Log in to your customer dashboard and continue your next getaway."
      variant="customer"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField label="Email address">
          <Input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </FormField>

        <FormField label="Password">
          <Input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
          />
        </FormField>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 text-sm">
          <Link href="/forgot-password" className="font-medium text-forest-700 hover:underline">
            Forgot password?
          </Link>
          <a href="/register" className="font-medium text-forest-700 hover:underline">
            Don&apos;t have an account? Register
          </a>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Log in"}
          <ArrowRight className="h-4 w-4" />
        </Button>

        <Button type="button" variant="outline" className="w-full" onClick={() => void handleDemoLogin()} disabled={loading}>
          Continue with demo customer
        </Button>
        <p className="text-center text-xs text-sand-500">Demo: {DEMO_CUSTOMER_EMAIL} / {DEMO_CUSTOMER_PASSWORD}</p>
      </form>
    </AuthShell>
  );
}

export function CustomerRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!acceptTerms) {
      setError("Please accept the Terms & Conditions before continuing.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          role: "customer",
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      const messageText = signUpError.message.toLowerCase();
      setError(messageText.includes("already") ? "An account with this email is already registered." : signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/account");
      router.refresh();
      return;
    }

    setMessage("Account created successfully. Please check your email to verify your account, then sign in.");
  };

  return (
    <AuthShell
      eyebrow="Travel On Wheels"
      title="Create your account"
      subtitle="Register to save your trips, compare vans, and book faster."
      variant="customer"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField label="Full name">
          <Input
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your full name"
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Email">
            <Input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Phone">
            <Input
              required
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+91 98765 43210"
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Password">
            <Input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 8 characters"
            />
          </FormField>

          <FormField label="Confirm password">
            <Input
              required
              type="password"
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter password"
            />
          </FormField>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-sand-200 bg-sand-50 p-3 text-sm text-sand-700">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(event) => setAcceptTerms(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-sand-300 text-forest-700 focus:ring-forest-600"
          />
          <span>
            I agree to the <Link href="/self-drive" className="font-semibold text-forest-700 underline">Terms &amp; Conditions</Link> and understand the booking rules.
          </span>
        </label>

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="text-center text-sm text-sand-600">
          Already have an account? <Link href="/login" className="font-semibold text-forest-700 hover:underline">Log in</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function CustomerForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage("Password reset instructions have been sent to your email address.");
  };

  return (
    <AuthShell
      eyebrow="Travel On Wheels"
      title="Reset your password"
      subtitle="We will email you a secure reset link to get you back on the road."
      variant="customer"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField label="Email address">
          <Input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </FormField>

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
          <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="text-center text-sm text-sand-600">
          <Link href="/login" className="font-semibold text-forest-700 hover:underline">
            Back to login
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

export function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (loginError) {
      setLoading(false);
      setError("Invalid admin credentials. Please try again.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      await supabase.auth.signOut();
      setLoading(false);
      setError("This login is for administrators only.");
      return;
    }

    setLoading(false);
    router.push("/admin");
    router.refresh();
  };

  return (
    <AuthShell
      eyebrow="Operations workspace"
      title="Admin sign in"
      subtitle="Secure access to bookings, vehicles, and operations controls."
      variant="admin"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField label="Work email">
          <Input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@travelonwheels.com"
          />
        </FormField>

        <FormField label="Password">
          <Input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />
        </FormField>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            Remember me
          </label>

          <Link href="/forgot-password" className="font-medium text-slate-700 hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </AuthShell>
  );
}

export function CustomerAuthIndex() {
  return (
    <div className="flex items-center justify-center py-10">
      <ButtonLink href="/login">Customer login</ButtonLink>
    </div>
  );
}
