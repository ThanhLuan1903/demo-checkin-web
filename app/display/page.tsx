

"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type CheckinPayload = {
  count: number
  target: number
  percentage: number
  messages?: string[]
}

export default function DisplayPage() {
  const [checkinData, setCheckinData] = useState<CheckinPayload>({
    count: 0,
    target: 60,
    percentage: 0,
    messages: [],
  })
  const [isComplete, setIsComplete] = useState(false)
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const eventSource = new EventSource("/api/checkin")

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as CheckinPayload & {
        messages?: string[]
      }

      setCheckinData(data)

      if (Array.isArray(data.messages)) {
        setMessages(data.messages)
      }

      if (data.percentage >= 100) {
        setIsComplete(true)
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => eventSource.close()
  }, [])

  const leftMessages = messages.filter((_, idx) => idx % 2 === 0)
  const rightMessages = messages.filter((_, idx) => idx % 2 === 1)

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-start gap-6 px-10 py-6"
    >
      <div className="w-full max-w-6xl text-center space-y-2 flex-none">
        <Image
          src="/thankyou.png"
          alt="Thank you"
          width={220}
          height={0}
          className="mx-auto"
        />
        <Image
          src="/jcidanang.png"
          alt="JCI Da Nang"
          width={220}
          height={0}
          className="mx-auto"
        />
        <p className="text-3xl">
          🎊 Happy 2026 JCI Da Nang New Year Convention 🎊
        </p>
        <p className="text-xl" style={{ color: "#4A6D87" }}>
          Live attendee check-in tracking & wishes
        </p>
      </div>

      {/* PROGRESS */}
      <div className="w-full max-w-6xl space-y-3 flex-none">
        <div className="flex justify-between items-center">
          <span
            className="font-semibold text-base"
            style={{ color: "#081C4C" }}
          >
            Progress
          </span>
          <span className="text-2xl font-bold" style={{ color: "#081C4C" }}>
            {checkinData.percentage}%
          </span>
        </div>

        <div
          className="w-full h-8 rounded-full overflow-hidden border"
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

      <div className="w-full max-w-6xl flex-1 grid grid-cols-3 gap-4">
        <div className="relative h-full">
          {leftMessages.map((m, idx) => (
            <div
              key={`left-${idx}`}
              className="absolute px-3 py-2 rounded-2xl text-xs"
              style={{
                top: `${(idx * 12) % 90}%`, 
                left: "8%",
                transform: "translateY(-50%)",
                backgroundColor: "#DAF8FF",
                color: "#081C4C",
                maxWidth: "80%",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              }}
            >
              {m}
            </div>
          ))}
        </div>

        <div
          className="relative h-full rounded-3xl overflow-hidden"
          style={{
          }}
        >
          <style jsx>{`
            @keyframes rocket-rise-loop {
              0% {
                transform: translateY(120px) scale(1);
                opacity: 1;
              }
              100% {
                transform: translateY(-260px) scale(0.9);
                opacity: 0;
              }
            }

            @keyframes messages-launch {
              0% {
                transform: translateY(100px);
                opacity: 1;
              }
              100% {
                transform: translateY(-200px);
                opacity: 0;
              }
            }
          `}</style>

          {isComplete ? (
            <>
              {/* Messages gom ở giữa & bay lên (lấy 5 message cuối) */}
              {messages.length > 0 && (
                <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                  <div className="animate-[messages-launch_6s_ease-in-out_infinite] flex flex-col gap-2 items-center">
                    {messages.slice(-5).map((m, idx) => (
                      <div
                        key={`center-${idx}`}
                        className="px-4 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: "#FFFFFF",
                          color: "#081C4C",
                          maxWidth: "260px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rocket bay lên lặp lại */}
              <div className="absolute inset-0 flex items-end justify-center">
                <div className="animate-[rocket-rise-loop_6s_ease-in-out_infinite]">
                  <Image
                    src="/rocket-rm.png"
                    alt="Rocket"
                    width={230}
                    height={230}
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
            </div>
          )}
        </div>

        {/* CỘT PHẢI – message chồng lên nhau */}
        <div className="relative h-full">
          {rightMessages.map((m, idx) => (
            <div
              key={`right-${idx}`}
              className="absolute px-3 py-2 rounded-2xl text-xs text-right"
              style={{
                top: `${(idx * 12) % 90}%`,
                right: "8%",
                transform: "translateY(-50%)",
                backgroundColor: "#DAF8FF",
                color: "#081C4C",
                maxWidth: "80%",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              }}
            >
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

