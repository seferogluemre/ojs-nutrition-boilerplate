import { Clock, MapPin, User } from "lucide-react"
import type { ParcelEvent } from "../types/types"

interface ParcelEventsTimelineProps {
  events: ParcelEvent[]
}

const getEventIcon = (type: string) => {
  switch (type) {
    case "CREATED":
      return "🏭"
    case "PICKED_UP":
      return "📦"
    case "IN_TRANSIT":
      return "🚛"
    case "ARRIVED_AT_HUB":
      return "🏢"
    case "OUT_FOR_DELIVERY":
      return "🚚"
    case "DELIVERED":
      return "✅"
    default:
      return "📍"
  }
}

const getEventColor = (type: string) => {
  switch (type) {
    case "DELIVERED":
      return "bg-green-100 border-green-300"
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      return "bg-blue-100 border-blue-300"
    case "CREATED":
    case "PICKED_UP":
    case "ARRIVED_AT_HUB":
      return "bg-gray-100 border-gray-300"
    default:
      return "bg-gray-100 border-gray-300"
  }
}

export function ParcelEventsTimeline({ events }: ParcelEventsTimelineProps) {
  return (
    <div className="p-6">
      <div className="mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Kargo Takibi
        </h3>
      </div>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${getEventColor(event.type)}`}
              >
                {getEventIcon(event.type)}
              </div>
              {index < events.length - 1 && <div className="w-0.5 h-6 bg-gray-200 mt-1" />}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{event.description}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {event.createdBy}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(event.timestamp).toLocaleDateString("tr-TR")}{" "}
                  {new Date(event.timestamp).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
