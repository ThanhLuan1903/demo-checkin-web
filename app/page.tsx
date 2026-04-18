"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import Image from "next/image";
const boatImages = ["/boat1.png", "/boat2.png", "/boat3.png"];

const getRandomBoat = () =>
  boatImages[Math.floor(Math.random() * boatImages.length)];
export default function SubmitPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [checkinNumber, setCheckinNumber] = useState(0);
  const [message, setMessage] = useState("");
  const [lastMessage, setLastMessage] = useState("");

  const [showReminder, setShowReminder] = useState(false);
  const [shakeButton, setShakeButton] = useState(false);

  const [checkedInBoat] = useState(getRandomBoat);
  const [formBoat] = useState(getRandomBoat);
  const [popupBoat] = useState(getRandomBoat);

  useEffect(() => {
    const userHasCheckedIn = localStorage.getItem("userCheckedIn");
    if (userHasCheckedIn) {
      setHasCheckedIn(true);
      setCheckinNumber(Number.parseInt(userHasCheckedIn));
    }
  }, []);

  useEffect(() => {
    if (hasCheckedIn) {
      setShowReminder(false);
      setShakeButton(false);
      return;
    }

    const t1 = setTimeout(() => setShowReminder(true), 120_000);
    const t2 = setTimeout(() => setShakeButton(true), 122_000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      setShowReminder(false);
      setShakeButton(false);
    };
  }, [hasCheckedIn]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setShowReminder(false);
    setShakeButton(false);

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      localStorage.setItem("userCheckedIn", data.count.toString());
      setHasCheckedIn(true);
      setCheckinNumber(data.count);
      setLastMessage(message);
      setShowPopup(true);
      setMessage("");
    } catch (error) {
      console.error("Failed to check in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const [countdown, setCountdown] = useState(120);
  useEffect(() => {
    if (hasCheckedIn) return;

    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, hasCheckedIn]);

  if (hasCheckedIn && !showPopup) {
    return (
      <>
        <style jsx>{`
          @keyframes riseBounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{ background: "linear-gradient(135deg, #E8D3B5, #F1E1CA)" }}
          // style={{ background: "linear-gradient(135deg, #D3F1F7, #DAF8FF)" }}
        >
          <Card
            className="p-10 shadow-2xl max-w-md w-full rounded-2xl text-center space-y-3"
            style={{ backgroundColor: "#EFF0F6" }}
          >
            <Image
              src="/group-logo.png"
              alt="Group Logo"
              width={250}
              height={0}
              className="mx-auto"
            />
            {/* <Image
              src="/jcidanang.png"
              alt="JCI"
              width={200}
              height={0}
              className="mx-auto"
            /> */}
            <Image
              src={checkedInBoat}
              alt="Vuon xa"
              width={120}
              height={40}
              className="mx-auto animate-[riseBounce_1.2s_ease-in-out_infinite]"
            />

            <p className="text-xl">
              2026 JCI Hoi An <br />
              Launching Ceremony
            </p>

            <Button
              onClick={() => {
                setHasCheckedIn(false);
                localStorage.removeItem("userCheckedIn");
              }}
              variant="outline"
              className="w-full rounded-full mt-4"
              // style={{
              //   background: "linear-gradient(135deg, #DAF8FF, #A0CBE7)",
              //   borderColor: "#A0CBE7",
              //   color: "#081C4C",
              // }}
              style={{
                background:
                  "linear-gradient(135deg, #C69C6D, #B88A5A, #A47445)",
                borderColor: "#A47445",
                color: "#081C4C",
              }}
            >
              Vươn Xa Lần Nữa
            </Button>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2"
      // style={{ background: "linear-gradient(135deg, #D3F1F7, #DAF8FF)" }}
      style={{ background: "linear-gradient(135deg, #E8D3B5, #F1E1CA)" }}
    >
      <div className="w-full max-w-md">
        <Card
          className="p-6 shadow-2xl rounded-2xl"
          style={{ backgroundColor: "#EFF0F6" }}
        >
          <div className="text-center space-y-2">
            <div className="space-y-2">
              <Image
                src="/group-logo.png"
                alt="Group Logo"
                width={250}
                height={0}
                className="mx-auto"
              />
              <h1 className="text-xl font-bold" style={{ color: "#081C4C" }}>
                Welcome!
              </h1>
              <p className="text-2xl" style={{ color: "#081C4C" }}>
                JCI Hoi An <br /> Launching Ceremony
              </p>
            </div>

            <div className="flex justify-center">
              <Image src={checkedInBoat} alt="boat" width={120} height={80} />
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium"
                  style={{ color: "#081C4C" }}
                >
                  Lời chúc của bạn
                </label>

                <span
                  className="text-sm font-semibold"
                  style={{ color: countdown <= 10 ? "#C2410C" : "#081C4C" }}
                >
                  Còn {Math.floor(countdown / 60)}:
                  {(countdown % 60).toString().padStart(2, "0")}
                </span>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded-xl border px-3 py-2 text-sm   placeholder:text-sm
    placeholder:text-slate-600"
                style={{
                  borderColor: "#A0CBE7",
                  backgroundColor: "#FFFFFF",
                  color: "#081C4C",
                }}
                placeholder="Bạn hãy viết một lời chúc cho JCI Hoi An nhé!"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full h-13 mt-6 flex items-center justify-center rounded-full shadow-md transition duration-200 border ${
                shakeButton ? "animate-bounce" : ""
              }`}
              style={{
                background:
                  "linear-gradient(135deg, #C69C6D, #B88A5A, #A47445)",
                borderColor: "#A47445",
              }}
            >
              <Image
                src="/vuonxa.png"
                alt="Vuon xa"
                width={150}
                height={30}
                className="mx-auto"
              />
            </Button>

            {isLoading && (
              <p className="text-sm mt-2" style={{ color: "#4A6D87" }}>
                Đang gửi lời chúc ...
              </p>
            )}

            {showReminder && !hasCheckedIn && !isLoading && (
              <p className="text-sm" style={{ color: "#C2410C" }}>
                Sắp hết giờ rồi — nhấn{" "}
                <span className="font-semibold">Vươn Xa</span> để gửi lời chúc
                nhé!
              </p>
            )}
          </div>
        </Card>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-0 shadow-2xl overflow-hidden rounded-2xl">
            <div className="relative p-6 text-center">
              <button
                onClick={handleClosePopup}
                className="absolute top-2 right-2 p-1 hover:bg-black/10 rounded-full transition"
              >
                <X size={22} />
              </button>
              <Image
                src="/jcihoian-logo.png"
                alt="JCI Hoi An"
                width={200}
                height={0}
                className="mx-auto"
              />

              <p className="text-2xl pt-8" style={{ color: "#081C4C" }}>
                JCI Hoi An <br /> Launching Ceremony
              </p>
              <p
                className="text-sm mt-4 flex items-center justify-center gap-2"
                style={{ color: "#4A6D87" }}
              >
                <span>Cảm ơn bạn! Thông điệp của bạn đang vươn xa</span>
                <span className="animate-bounce">⛵</span>
              </p>

              <div className="relative h-70 overflow-hidden rounded-2xl">
                <style jsx>{`
                  @keyframes rocket-rise-popup {
                    0% {
                      transform: translateY(80px) scale(1);
                      opacity: 1;
                    }
                    100% {
                      transform: translateY(-160px) scale(0.9);
                      opacity: 0;
                    }
                  }

                  @keyframes message-rise-popup {
                    0% {
                      transform: translateY(100px);
                      opacity: 0;
                    }
                    20% {
                      opacity: 1;
                    }
                    100% {
                      transform: translateY(-120px);
                      opacity: 0;
                    }
                  }
                `}</style>

                {lastMessage && (
                  <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                    <div
                      className="px-4 py-2 rounded-full text-sm max-w-xs text-center animate-[message-rise-popup_3s_ease-in-out_infinite]"
                      style={{
                        backgroundColor: "#FFFFFF",
                        color: "#081C4C",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      {lastMessage}
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 flex items-end justify-center">
                  <div className="animate-[rocket-rise-popup_3s_ease-in-out_infinite]">
                    <Image
                      src={checkedInBoat}
                      alt="Boat"
                      width={120}
                      height={140}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
