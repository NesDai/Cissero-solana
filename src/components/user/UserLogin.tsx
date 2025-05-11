"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/services/eventService";
import { toast } from "@/components/ui/use-toast";

export function UserLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo, we'll just check if the username exists
      const user = loginUser(username);

      if (user) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.displayName}!`,
        });
        onLogin();
      } else {
        toast({
          title: "Login Failed",
          description: "Username not found",
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
          <h1 className="text-2xl font-bold text-green-500">User Login</h1>
          <p className="mt-2 text-gray-400">
            Sign in to view events and place predictions
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-white">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
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
            <p>For demo: use viewer123, predictionking, or chatmaster</p>
          </div>
        </form>
      </div>
    </div>
  );
}
