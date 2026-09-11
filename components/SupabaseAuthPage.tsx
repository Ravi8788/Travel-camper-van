"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button, Card, CardContent, Container, FormField, Input } from "@/components/ui";
import { PageContent } from "@/components/layout/PageBanner";

type AuthMode = "login" | "signup" | "forgot";

type SupabaseAuthPageProps = {
  mode: AuthMode;
  nextPath?: string;
  admin?: boolean;
};

export function SupabaseAuthPage({ mode, nextPath = "/account", admin = false }: SupabaseAuthPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    if (mode === "login") {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) { setLoading(false); setError(loginError.message); return; }
      if (admin) {
        const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
        if (profileError || profile?.role !== "admin") {
          await supabase.auth.signOut();
          setLoading(false);
          setError("This account does not have admin access.");
          return;
        }
      }
      setLoading(false);
      window.location.href = admin ? "/admin" : nextPath;
      return;
    }

    const result = mode === "signup"
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: name, role: "traveller" } } })
      : await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/forgot-password` });

    setLoading(false);
    if (result.error) { setError(result.error.message); return; }

    if (mode === "forgot") {
      setMessage("Check your email for a password reset link.");
      return;
    }

    if (mode === "signup") {
      setMessage("Check your email to confirm your account, then come back to sign in.");
      return;
    }

  };

  const title = mode === "signup" ? "Start your story" : mode === "forgot" ? "Reset your password" : admin ? "Admin access" : "Welcome back";
  const action = mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in";

  return <PageContent className="min-h-[65vh] bg-sand-100 py-10 sm:py-16"><Container><Card className="mx-auto max-w-lg overflow-hidden"><div className="bg-forest-700 p-7 text-sand-50 sm:p-9"><p className="text-sm font-bold uppercase tracking-[0.18em] text-accent-300">{admin ? "Travel On Wheels / Admin" : "Travel On Wheels"}</p><h1 className="mt-4 font-display text-4xl font-bold text-sand-50">{title}</h1><p className="mt-3 text-forest-100">{admin ? "Sign in to manage vans, bookings, and guest journeys." : "Your next escape is closer than you think."}</p></div><CardContent className="p-6 sm:p-9"><form className="space-y-5" onSubmit={submit}>{mode === "signup" && <FormField label="Full name"><Input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></FormField>}<FormField label="Email"><Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></FormField>{mode !== "forgot" && <FormField label="Password"><Input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /></FormField>}{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <div className="flex gap-3 rounded-lg bg-forest-50 p-3 text-sm text-forest-700"><Check className="h-5 w-5 shrink-0" />{message}</div>}<Button type="submit" disabled={loading} className="w-full">{loading ? "Working..." : action}<ArrowRight className="h-4 w-4" /></Button></form></CardContent></Card></Container></PageContent>;
}
