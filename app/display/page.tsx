"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
export default function DisplayPage() {
  const [checkinData, setCheckinData] = useState({
    count: 0,
    target: 60,
    percentage: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("/api/checkin");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCheckinData(data);

      if (data.percentage >= 100) {
        setIsComplete(true);
        triggerCelebration();
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  const triggerCelebration = () => {
    if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
      createConfetti();
    }
  };

  const createConfetti = () => {
    const confettiPieces = 50;
    for (let i = 0; i < confettiPieces; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = "-10px";
      confetti.style.width = "10px";
      confetti.style.height = "10px";
      confetti.style.backgroundColor = [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#ffa502",
        "#ff006e",
      ][Math.floor(Math.random() * 5)];
      confetti.style.borderRadius = "50%";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = "9999";
      document.body.appendChild(confetti);

      const duration = Math.random() * 2 + 2;
      const keyframes = `
        @keyframes fall-${i} {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;

      const style = document.createElement("style");
      style.textContent = keyframes;
      document.head.appendChild(style);

      confetti.style.animation = `fall-${i} ${duration}s linear forwards`;

      setTimeout(() => {
        confetti.remove();
      }, duration * 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="p-12 shadow-2xl text-center max-w-md space-y-1">
        <div className="space-y-2">
          <Image
            src="/thankyou.png"
            alt="Thank you"
            width={200}
            height={0}
            className="mx-auto"
          />
          <Image
            src="/jcidanang.png"
            alt="Thank you"
            width={200}
            height={0}
            className="mx-auto"
          />
          <p className="text-2xl">
            🎊 Happy New Year Convention JCI Da Nang 2026 🎊
          </p>
          <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
          <p className="text-muted-foreground text-lg">
            Live attendee check-in tracking
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span
              className="font-semibold text-sm"
              style={{ color: "#081C4C" }}
            >
              Progress
            </span>
            <span className="text-xl font-bold" style={{ color: "#081C4C" }}>
              {checkinData.percentage}%
            </span>
          </div>

          <div
            className="w-full h-8 rounded-full overflow-hidden border"
            style={{
              backgroundColor: "#EFF0F6", // nền thanh
              borderColor: "#A0CBE7", // viền thanh
            }}
          >
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${checkinData.percentage}%`,
                background: "linear-gradient(90deg, #DAF8FF, #A0CBE7)", // màu chạy
              }}
            />
          </div>
        </div>

        {isComplete && (
          <div
            className="relative h-60 overflow-hidden rounded-2xl"
            style={{
              background: "radial-gradient(circle at 20% 0, #DAF8FF, #D3F1F7)",
            }}
          >
            <style jsx>{`
              @keyframes rocket-rise {
                0% {
                  transform: translateY(120px) scale(1);
                  opacity: 1;
                }
                100% {
                  transform: translateY(-260px) scale(0.9);
                  opacity: 0;
                }
              }
            `}</style>

            <div className="absolute inset-0 flex items-end justify-center">
              <div
                className="animate-[rocket-rise_6s_ease-in-out_forwards]"
                style={{ animationIterationCount: 1 }}
              >
                <Image
                  src="/rocket-rm.png"
                  alt="Rocket"
                  width={220}
                  height={220}
                />
              </div>
            </div>
          </div>
        )}

        {!isComplete && (
          <div className="text-center pt-4">
            <p style={{ color: "#4A6D87" }}>
              Guests are checking in... the rocket will launch when everyone has
              arrived!
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
