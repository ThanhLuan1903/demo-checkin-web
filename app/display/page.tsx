"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { is } from "date-fns/locale";
const boatImages = ["/boat1.png", "/boat2.png", "/boat3.png"];
type CheckinPayload = {
  count: number;
  target: number;
  percentage: number;
  messages?: string[];
};

type FlightMessage = {
  id: number;
  text: string;
  lane: number;
  image: string; // 👈 thêm
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

  const [flightMessages, setFlightMessages] = useState<FlightMessage[]>([]);

  const lastMessageCountRef = useRef(0);
  const nextLaneRef = useRef(0);


  const handleReset = async () => {
    try {
      await fetch("/api/checkin", {
        method: "DELETE",
      });

      setCheckinData({
        count: 0,
        target: checkinData.target,
        percentage: 0,
        messages: [],
      });
      setMessages([]);
      setFlightMessages([]);
      setIsComplete(false);
      lastMessageCountRef.current = 0;
      nextLaneRef.current = 0;
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

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

            // setFlightMessages((prev) => [...prev, { id, text, lane }]);

            const randomImage = `/boat${Math.floor(Math.random() * 3) + 1}.png`;

            setFlightMessages((prev) => [
              ...prev,
              { id, text, lane, image: randomImage },
            ]);

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
    if (!isComplete) return;

    let fireworks: any;

    import("fireworks-js").then(({ Fireworks }) => {
      const container = document.getElementById("fireworks-canvas");
      if (!container) return;

      fireworks = new Fireworks(container, {
        autoresize: true,
        opacity: 0.9,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 120,
        traceLength: 3,
        traceSpeed: 10,
        explosion: 6,
        intensity: 35,
        flickering: 50,
        rocketsPoint: { min: 0, max: 100 }, 
        lineStyle: "round",
        hue: { min: 0, max: 360 },
        delay: { min: 20, max: 40 },
        sound: {
          enabled: true,
          files: ["/firework.mp3"], 
          volume: { min: 2, max: 4 },
        },
      });

      fireworks.start();
    });

    return () => {
      if (fireworks) {
        fireworks.stop();
        fireworks.clear();
      }
    };
  }, [isComplete]);

  const celebrationBoats = useMemo(
    () =>
      messages.map(
        () => boatImages[Math.floor(Math.random() * boatImages.length)],
      ),
    [messages],
  );

  return (
    <div className="relative h-screen overflow-hidden w-full flex flex-col items-center justify-start gap-6 px-10 py-6 bg-[url('/jcihoian-banner.png')] bg-cover bg-center bg-no-repeat">
      {isComplete && (
        <button
          onClick={handleReset}
          className="absolute bottom-6 left-6 z-[100] rounded-full p-2 shadow-lg transition hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.92)",
            color: "#081C4C",
          }}
          aria-label="Reset check-in"
          title="Reset check-in"
        >
          <RotateCcw size={10} />
        </button>
      )}
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
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
          }
          85% {
            transform: translate3d(100vw, -100vh, 0) scale(1.08);
            opacity: 1;
          }
          100% {
            transform: translate3d(110vw, -110vh, 0) scale(1.1);
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

      {/* HEADER */}
      <div className="w-full max-w-6xl text-center space-y-2 flex-none">
        <Image
          src="/group-logo.png"
          alt="Logo header"
          width={300}
          height={0}
          className="mx-auto"
        />
        {/* <p className="text-xl text-white">
          2026 JCI Danang New Year Convention
        </p> */}
      </div>

      {/* PROGRESS */}
      {!isComplete && (
        <div className="absolute top-[70vh] left-1/2 -translate-x-1/2 w-full max-w-6xl space-y-3 flex-none">
          <div className="flex justify-between items-center">
            <span
              className="font-semibold text-base"
              style={{ color: "#a9cde0" }}
            >
              Progress
            </span>
            <span className="text-2xl font-bold" style={{ color: "#ffffff" }}>
              {checkinData.percentage}%
            </span>
          </div>

          <div
            className="w-full h-6 rounded-full overflow-hidden border"
            style={{
              backgroundColor: "#F3E4CE",
              borderColor: "#D9B98F",
            }}
          >
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${checkinData.percentage}%`,
                background: "linear-gradient(90deg, #F1D6A8, #E0B97A, #C7923E)",
              }}
            />
          </div>
        </div>
      )}
      <div className="w-full max-w-6xl flex-1 relative overflow-hidden">
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
                  animation: "flightRocket 4s linear forwards",
                }}
              >
                <Image src={f.image} alt="Rocket" width={120} height={120} />
                <div
                  className="px-3 py-1 rounded-2xl text-lg text-center"
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
              className="fixed left-0 bottom-0 z-[60] -translate-x-50 translate-y-50"
              style={{
                animation: "celebrateRocket 24s linear infinite",
              }}
            >
              <Image
                src="/main-boat1.png"
                alt="Rocket big"
                width={320}
                height={260}
              />
            </div>

            <div className="absolute inset-0 flex flex-wrap items-end justify-center gap-2 px-8">
              {messages.map((m, idx) => (
                <div
                  key={`celebrate-${idx}`}
                  className="text-lg text-center"
                  style={{
                    maxWidth: "260px",
                    margin: "4px",
                    animation: "celebrateMessage 7s linear infinite",
                    animationDelay: `${(idx % 10) * 0.3}s`,
                  }}
                >
                  <Image
                    src={celebrationBoats[idx]}
                    alt="boat"
                    width={70}
                    height={70}
                    className="mx-auto mb-1"
                  />

                  <div
                    className="px-3 py-1 rounded-2xl"
                    style={{
                      backgroundColor: "rgba(250,250,250,0.95)",
                      color: "#081C4C",
                      fontSize: "18px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                      maxWidth: "260px",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {m}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* <audio src="/firework.mp3" autoPlay loop className="hidden" /> */}
        </div>
      )}

      {/* {isComplete && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div id="fireworks-canvas" className="absolute inset-0" />
        </div>
      )} */}
    </div>
  );
}
