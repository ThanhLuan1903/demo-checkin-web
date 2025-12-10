import { type NextRequest, NextResponse } from "next/server"

let checkinCount = 0;
const targetNumber = 60;
const clients: Set<ReadableStreamDefaultController> = new Set()

let messages: string[] = []

export async function POST(request: NextRequest) {
  checkinCount += 1

  let body: any = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const message =
    typeof body?.message === "string" ? body.message.trim() : ""

  if (message) {
    messages.push(message)
    if (messages.length > 100) {
      messages = messages.slice(-100)
    }
  }

  const percentage = Math.min((checkinCount / targetNumber) * 100, 100)
  const payload = {
    count: checkinCount,
    target: targetNumber,
    percentage: Math.round(percentage),
    messages,
    timestamp: new Date().toISOString(),
  }

  const sseMessage = `data: ${JSON.stringify(payload)}\n\n`

  clients.forEach((client) => {
    try {
      client.enqueue(sseMessage)
    } catch {
      clients.delete(client)
    }
  })

  return NextResponse.json({
    success: true,
    ...payload,
  })
}

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller)

      const percentage = Math.min((checkinCount / targetNumber) * 100, 100)
      const initialPayload = {
        count: checkinCount,
        target: targetNumber,
        percentage: Math.round(percentage),
        messages,
        timestamp: new Date().toISOString(),
      }

      controller.enqueue(`data: ${JSON.stringify(initialPayload)}\n\n`)
      return () => {
        clients.delete(controller)
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

export async function DELETE(request: NextRequest) {
  checkinCount = 0
  messages = []

  const payload = {
    count: 0,
    target: targetNumber,
    percentage: 0,
    messages,
    timestamp: new Date().toISOString(),
  }

  clients.forEach((client) => {
    try {
      client.enqueue(`data: ${JSON.stringify(payload)}\n\n`)
    } catch {
      clients.delete(client)
    }
  })

  return NextResponse.json({ success: true, reset: true })
}
