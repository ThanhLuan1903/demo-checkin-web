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

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start py-8 px-10 gap-8"
      // style={{ background: "linear-gradient(135deg, #D3F1F7, #DAF8FF)" }}
    >
      <div className="w-full max-w-5xl text-center space-y-2">
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

      <div className="w-full max-w-5xl space-y-3">
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

      {messages.length > 0 && (
        <div className="w-full max-w-5xl mt-2">
          <div className="flex flex-wrap gap-3 items-start">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className="inline-flex px-4 py-2 rounded-2xl text-sm"
                style={{
                  backgroundColor: "#DAF8FF",
                  color: "#081C4C",
                  maxWidth: "320px", 
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl flex-1 flex items-center justify-center">
        {isComplete ? (
          <div
            className="relative w-full h-72 overflow-hidden rounded-3xl"
            style={{
              background: "radial-gradient(circle at 20% 0, #DAF8FF, #D3F1F7)",
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

            {/* Messages gom lại giữa & bay lên */}
            {messages.length > 0 && (
              <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                <div className="animate-[messages-launch_6s_ease-in-out_infinite] flex flex-col gap-2 items-center">
                  {messages.slice(-5).map((m, idx) => (
                    <div
                      key={idx}
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

            {/* Rocket bay lên nhiều lần */}
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
          </div>
        ) : (
          <div>
          </div>
        )}
      </div>
    </div>
  )
}
