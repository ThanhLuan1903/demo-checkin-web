import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="p-12 shadow-2xl">
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-primary mb-4">Event Check-In System</h1>
              <p className="text-lg text-muted-foreground">Real-time attendee tracking and live display</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-primary">For Attendees</h2>
                <p className="text-muted-foreground mb-4">Check in when you arrive at the event</p>
                <Link href="/submit" className="block">
                  <Button className="w-full" size="lg">
                    Go to Check-In Page
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-primary">For Display Screen</h2>
                <p className="text-muted-foreground mb-4">Show real-time progress on big screens</p>
                <Link href="/display" className="block">
                  <Button className="w-full bg-transparent" size="lg" variant="outline">
                    Go to Display Page
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg text-left space-y-2">
              <h3 className="font-bold text-primary">How it works:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Attendees visit the Check-In page and click Submit</li>
                <li>✓ The Display page shows live updates via real-time data</li>
                <li>✓ When 100% is reached, a rocket animation launches</li>
                <li>✓ All updates are instant across all connected screens</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
