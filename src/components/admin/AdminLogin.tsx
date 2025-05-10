"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/services/adminService";
import { toast } from "@/components/ui/use-toast";

export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo, use any of the admin emails with any password
      const admin = loginAdmin(email, password);

      if (admin) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${admin.name}!`,
        });
        onLogin();
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-500">Admin Login</h1>
          <p className="mt-2 text-gray-400">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm text-gray-400">
            <p>For demo: use admin@example.com with any password</p>
          </div>
        </form>
      </div>
    </div>
  );
}
