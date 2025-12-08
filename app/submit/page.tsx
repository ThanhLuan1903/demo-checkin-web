"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import Image from "next/image";

export default function SubmitPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [checkinNumber, setCheckinNumber] = useState(0);

  useEffect(() => {
    const userHasCheckedIn = localStorage.getItem("userCheckedIn");
    if (userHasCheckedIn) {
      setHasCheckedIn(true);
      setCheckinNumber(Number.parseInt(userHasCheckedIn));
    }
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
      });

      const data = await response.json();

      localStorage.setItem("userCheckedIn", data.count.toString());
      setHasCheckedIn(true);
      setCheckinNumber(data.count);
      setShowPopup(true);
    } catch (error) {
      console.error("Failed to check in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (hasCheckedIn && !showPopup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="p-12 shadow-2xl text-center max-w-md space-y-2">
          <div>
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
            <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
            <p className="text-muted-foreground text-lg">
              Your check-in has been recorded
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground" style={{ color: "#4A6D87" }}>
              Enjoy the event!
            </p>
            <p className="text-2xl">
              🎊 Happy New Year Convention JCI Da Nang 2026 🎊
            </p>
          </div>

          <Button
            onClick={() => {
              setHasCheckedIn(false);
              localStorage.removeItem("userCheckedIn");
            }}
            variant="outline"
            className="w-full"
            style={{
              background: "linear-gradient(135deg, #DAF8FF, #A0CBE7)",
              borderColor: "#A0CBE7",
            }}
          >
            Check In Again (if needed)
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-2xl">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <Image
                src="/thankyou.png"
                alt="Thank you"
                width={200}
                height={0}
                className="mx-auto"
              />{" "}
              <Image
                src="/jcidanang.png"
                alt="Thank you"
                width={200}
                height={0}
                className="mx-auto"
              />
              <h1 className="text-3xl font-bold text-primary">Welcome!</h1>
              <p className="text-2xl" style={{ color: "#081C4C" }}>
                🎊 Happy New Year Convention JCI Da Nang 2026 🎊
              </p>
            </div>
            <div className="flex justify-center">
              <Image src="/rocket.png" alt="rocket" width={180} height={180} />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="
    w-full h-16 
    flex items-center justify-center 
    rounded-xl
    shadow-md
    transition 
    duration-200
    border
  "
              style={{
                background: "linear-gradient(135deg, #DAF8FF, #A0CBE7)",
                borderColor: "#A0CBE7",
              }}
            >
              <Image
                src="/risenow.png"
                alt="Rise Now"
                width={260}
                height={40}
                className="scale-65"
              />
            </Button>

            {isLoading && (
              <p className="text-sm mt-2" style={{ color: "#4A6D87" }}>
                Checking in...
              </p>
            )}
          </div>
        </Card>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-0 shadow-2xl overflow-hidden rounded-2xl">
            <div className="relative p-10 text-center">
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 p-1 hover:bg-black/10 rounded-full transition"
              >
                <X size={22} />
              </button>

              <p className="text-2xl" style={{ color: "#081C4C" }}>
                🎊 Happy New Year Convention JCI Da Nang 2026 🎊
              </p>

              <div className="flex justify-center mb-4">
                <Image
                  src="/rocket-rm.png"
                  alt="Rocket"
                  width={120}
                  height={120}
                />
              </div>

              <p
                className="text-base leading-relaxed mt-2"
                style={{ color: "#4A6D87" }}
              >
                Thank you for attending! We're excited to celebrate this special
                event with you.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
