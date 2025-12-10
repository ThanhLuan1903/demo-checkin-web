"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type CheckinPayload = {
  count: number;
  target: number;
  percentage: number;
  messages?: string[];
};

type FlightMessage = {
  id: number;
  text: string;
  lane: number; // 0..4
};

export default function DisplayPage() {
  const [checkinData, setCheckinData] = useState<CheckinPayload>({
    count: 0,
    target: 60,
    percentage: 0,
    messages: [],
  });
  const [isComplete, setIsComplete] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  // Các message đang bay (rocket + bubble) khi chưa complete
  const [flightMessages, setFlightMessages] = useState<FlightMessage[]>([]);

  // Để biết message nào mới được thêm
  const lastMessageCountRef = useRef(0);
  // lane tiếp theo từ 0 → 4
  const nextLaneRef = useRef(0);
  // tránh trigger celebration nhiều lần
  const hasTriggeredCelebrationRef = useRef(false);

  useEffect(() => {
    const eventSource = new EventSource("/api/checkin");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as CheckinPayload & {
        messages?: string[];
      };

      setCheckinData(data);

      if (Array.isArray(data.messages)) {
        setMessages(data.messages);

        // Xử lý message mới cho animation rocket bay (trạng thái < 100%)
        const total = data.messages.length;
        const prevCount = lastMessageCountRef.current;

        if (total > prevCount && data.percentage < 100) {
          const newMsgs = data.messages.slice(prevCount);

          newMsgs.forEach((text) => {
            const lane = nextLaneRef.current;
            nextLaneRef.current = (nextLaneRef.current + 1) % 5;

            const id = Date.now() + Math.random();

            setFlightMessages((prev) => [...prev, { id, text, lane }]);

            // Xóa sau 5 giây (trùng với thời gian animation rocket)
            setTimeout(() => {
              setFlightMessages((prev) => prev.filter((f) => f.id !== id));
            }, 5000);
          });

          lastMessageCountRef.current = total;
        }
      }

      if (data.percentage >= 100) {
        setIsComplete(true);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  useEffect(() => {
  if (isComplete && !hasTriggeredCelebrationRef.current) {
    hasTriggeredCelebrationRef.current = true;

    import("canvas-confetti").then((module) => {
      const confetti = module.default;

      const burst = () => {
        confetti({ particleCount: 60, spread: 80, origin: { x: 0.2, y: 0.3 } });
        confetti({ particleCount: 60, spread: 80, origin: { x: 0.5, y: 0.3 } });
        confetti({ particleCount: 60, spread: 80, origin: { x: 0.8, y: 0.3 } });
      };

      burst(); 

      const interval = setInterval(() => burst(), 1200); 

      setTimeout(() => clearInterval(interval), 30000);
    });
  }
}, [isComplete]);


  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-start gap-6 px-10 py-6 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
      <style jsx global>{`
        @keyframes flightRocket {
          0% {
            transform: translate(-50%, 110%);
            opacity: 1;
          }
          90% {
            transform: translate(-50%, -90%);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -110%);
            opacity: 0;
          }
        }

        @keyframes celebrateRocket {
          0% {
            transform: translateY(100vh) scale(1);
            opacity: 1;
          }
          90% {
            transform: translateY(-80vh) scale(1.08);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1.1);
            opacity: 0;
          }
        }

        @keyframes celebrateMessage {
          0% {
            transform: translateY(100vh); 
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          90% {
            transform: translateY(-80vh); 
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh); /* bay hết */
            opacity: 0;
          }
        }
      `}</style>

      <div className="w-full max-w-6xl text-center space-y-2 flex-none">
        <Image
          src="/thankyou.png"
          alt="Thank you"
          width={200}
          height={0}
          className="mx-auto"
        />
        <Image
          src="/jcidanang.png"
          alt="JCI Da Nang"
          width={200}
          height={0}
          className="mx-auto"
        />
        <p className="text-xl text-white">
          🎊 Happy New Year Convention JCI Da Nang 2026 🎊
        </p>
      </div>

      {/* PROGRESS */}
      <div className="w-full max-w-6xl space-y-3 flex-none">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-base text-white">Progress</span>
          <span className="text-2xl font-bold text-white">
            {checkinData.percentage}%
          </span>
        </div>

        <div
          className="w-full h-6 rounded-full overflow-hidden border"
          style={{
            backgroundColor: "#EFF0F6",
            borderColor: "#A0CBE7",
          }}
        >
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${checkinData.percentage}%`,
              background: "linear-gradient(90deg, #DAF8FF, #A0CBE7)",
            }}
          />
        </div>
      </div>

      {/* KHU VỰC DƯỚI PROGRESS – ROCKET LANES (5 cột) */}
      <div className="w-full max-w-6xl flex-1 relative overflow-hidden">
        {/* Các rocket + message đang bay (trạng thái < 100%) */}
        {!isComplete &&
          flightMessages.map((f) => {
            const laneWidth = 100 / 5;
            const laneCenter = f.lane * laneWidth + laneWidth / 2;

            return (
              <div
                key={f.id}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${laneCenter}%`,
                  bottom: "-10%",
                  transform: "translateX(-50%)",
                  animation: "flightRocket 8s linear forwards",
                }}
              >
                <Image
                  src="/rocket-rm.png"
                  alt="Rocket"
                  width={80}
                  height={80}
                />
                <div
                  className="px-3 py-1 rounded-2xl text-xs text-center"
                  style={{
                    backgroundColor: "#DAF8FF",
                    color: "#081C4C",
                    maxWidth: "210px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    marginTop: "8px",
                  }}
                >
                  {f.text}
                </div>
              </div>
            );
          })}
      </div>

      {isComplete && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-end pb-10">
            {/* Rocket chính */}
            <div
              className="mb-6"
              style={{
                animation: "celebrateRocket 8s ease-in-out infinite",
              }}
            >
              <Image
                src="/rocket-rm.png"
                alt="Rocket big"
                width={260}
                height={260}
              />
            </div>

            <div className="absolute inset-0 flex flex-wrap items-end justify-center gap-2 px-8">
              {messages.map((m, idx) => (
                <div
                  key={`celebrate-${idx}`}
                  className="px-3 py-1 rounded-2xl text-xs md:text-sm text-center"
                  style={{
                    backgroundColor: "rgba(250,250,250,0.95)",
                    color: "#081C4C",
                    maxWidth: "260px",
                    margin: "4px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    animation: "celebrateMessage 7s linear infinite",
                    animationDelay: `${(idx % 10) * 0.3}s`,
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>

          <audio src="/firework.mp3" autoPlay loop className="hidden" />
        </div>
      )}
    </div>
  );
}
