import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

export const SignUpForm = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuthStore();
  const { pushToast } = useToastStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      pushToast({
        type: "error",
        title: "Passwords do not match",
      });
      return;
    }

    const { error } = await signUp(email, password);

    if (error) {
      pushToast({
        type: "error",
        title: "Sign up failed",
        description: error,
      });
      return;
    }

    pushToast({
      type: "success",
      title: "Account created",
      description: "Check your email for a confirmation link.",
    });

    navigate("/login");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Start building and running SQL visually.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <Button className="w-full" type="submit" isLoading={loading}>
            Sign Up
          </Button>

          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="text-indigo-600 hover:text-indigo-500" to="/login">
              Log in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
