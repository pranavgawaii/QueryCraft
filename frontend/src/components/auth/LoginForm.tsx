import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Chrome, User } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loginAsDemo, loading } = useAuthStore();
  const { pushToast } = useToastStore();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { error } = await login(email, password);
    if (error) {
      pushToast({
        type: "error",
        title: "Login failed",
        description: error,
      });
      return;
    }

    const redirect = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    navigate(redirect ?? "/dashboard", { replace: true });

    pushToast({
      type: "success",
      title: "Logged in",
      description: "Welcome back to QueryCraft.",
    });
  };

  const onGoogleLogin = async () => {
    const { error } = await loginWithGoogle();
    if (error) {
      pushToast({
        type: "error",
        title: "Google login failed",
        description: error,
      });
    }
  };

  const onDemoLogin = async () => {
    await loginAsDemo();
    pushToast({
      type: "success",
      title: "Logged in as Demo User",
      description: "Welcome to the QueryCraft demo.",
    });
    navigate("/dashboard");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Log in to QueryCraft</CardTitle>
        <CardDescription>Build SQL visually without writing code.</CardDescription>
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <Button className="w-full" type="submit" isLoading={loading}>
            Log In
          </Button>

          <Button className="w-full" type="button" variant="outline" onClick={onGoogleLogin}>
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or try it out</span>
            </div>
          </div>

          <Button className="w-full" type="button" variant="secondary" onClick={onDemoLogin}>
            <User className="mr-2 h-4 w-4" />
            Try Demo Account
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Link className="text-indigo-600 hover:text-indigo-500" to="/signup">
              Create account
            </Link>
            <Link className="text-indigo-600 hover:text-indigo-500" to="/reset-password">
              Forgot password?
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
