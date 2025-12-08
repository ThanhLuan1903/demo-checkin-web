import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (replace with database in production)
let checkinCount = 0
const targetNumber = 3
const clients: Set<ReadableStreamDefaultController> = new Set()

export async function POST(request: NextRequest) {
  checkinCount += 1

  // Notify all connected WebSocket clients
  const percentage = Math.min((checkinCount / targetNumber) * 100, 100)
  const message = JSON.stringify({
    count: checkinCount,
    target: targetNumber,
    percentage: Math.round(percentage),
    timestamp: new Date().toISOString(),
  })

  // Broadcast to all clients
  clients.forEach((client) => {
    try {
      client.enqueue(`data: ${message}\n\n`)
    } catch (e) {
      clients.delete(client)
    }
  })

  return NextResponse.json({
    success: true,
    count: checkinCount,
    target: targetNumber,
    percentage: Math.round(percentage),
  })
}

export async function GET(request: NextRequest) {
  // Server-Sent Events (SSE) endpoint for real-time updates
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller)

      // Send initial state
      const percentage = Math.min((checkinCount / targetNumber) * 100, 100)
      const initialData = JSON.stringify({
        count: checkinCount,
        target: targetNumber,
        percentage: Math.round(percentage),
        timestamp: new Date().toISOString(),
      })

      controller.enqueue(`data: ${initialData}\n\n`)

      // Cleanup on disconnect
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
  // Reset endpoint for testing
  checkinCount = 0

  clients.forEach((client) => {
    try {
      client.enqueue(
        `data: ${JSON.stringify({
          count: 0,
          target: targetNumber,
          percentage: 0,
          timestamp: new Date().toISOString(),
        })}\n\n`,
      )
    } catch (e) {
      clients.delete(client)
    }
  })

  return NextResponse.json({ success: true, reset: true })
}
