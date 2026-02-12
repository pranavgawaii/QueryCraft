import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

export const ResetPassword = () => {
  const { sendPasswordReset } = useAuthStore();
  const { pushToast } = useToastStore();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await sendPasswordReset(email);

    setLoading(false);

    if (error) {
      pushToast({
        type: "error",
        title: "Password reset failed",
        description: error,
      });
      return;
    }

    pushToast({
      type: "success",
      title: "Reset link sent",
      description: "Check your email for the password reset link.",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>We will email you a secure password reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button className="w-full" type="submit" isLoading={loading}>
              Send Reset Link
            </Button>
            <Link to="/login" className="block text-center text-sm text-indigo-600 hover:text-indigo-500">
              Back to Login
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
