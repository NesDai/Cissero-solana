"use client";

import { useState, useEffect } from "react";
import { UserHeader } from "@/components/user/UserHeader";
import {
  getCurrentUser,
  getUserPredictions,
  Prediction,
  Event,
} from "@/services/eventService";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ClientOnly from "@/components/ClientOnly";

export default function MyPredictionsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState<
    Array<Prediction & { event: Event; participantName: string }>
  >([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/user");
      return;
    }

    loadPredictions();
  }, [router]);

  const loadPredictions = async () => {
    try {
      const userPredictions = await getUserPredictions();
      setPredictions(userPredictions);
    } catch (error) {
      console.error("Error loading predictions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UserHeader onLogout={() => router.push("/user")} />

      <ClientOnly>
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">My Predictions</h1>

          {predictions.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl text-gray-400 mb-6">
                You haven't made any predictions yet
              </h2>
              <Link href="/user">
                <Button className="bg-green-600 hover:bg-green-500">
                  Browse Events
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {predictions.map((prediction) => (
                <Card
                  key={prediction.id}
                  className="bg-gray-900 border-gray-800"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-white">
                        {prediction.event.title}
                      </CardTitle>
                      <Badge
                        variant={
                          prediction.status === "active"
                            ? "default"
                            : prediction.status === "won"
                            ? "success"
                            : prediction.status === "lost"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {prediction.status.charAt(0).toUpperCase() +
                          prediction.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="text-sm text-gray-400 mb-4">
                      {new Date(prediction.event.date).toLocaleDateString()} at{" "}
                      {prediction.event.time}
                    </div>

                    <div className="flex justify-between items-center bg-gray-800 p-3 rounded-md mb-4">
                      <div className="font-medium">Your prediction:</div>
                      <div className="font-bold text-green-400">
                        {prediction.participantName}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        {new Date(prediction.timestamp).toLocaleString()}
                      </div>
                      <div className="font-bold text-green-400">
                        {prediction.amount} points
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link href={`/user/event/${prediction.event.id}`}>
                        <Button
                          variant="outline"
                          className="w-full border-green-600 text-green-500 hover:bg-green-900"
                        >
                          View Event
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </ClientOnly>
    </div>
  );
}
