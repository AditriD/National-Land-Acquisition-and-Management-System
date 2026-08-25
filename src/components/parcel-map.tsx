'use client'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

const riskColor: Record<string, string> = {
  LOW: '#22c55e',
  MEDIUM: '#eab308',
  HIGH: '#ef4444',
}

type MapParcel = {
  id: string
  surveyNumber: string
  latitude: number
  longitude: number
  status: string
  riskLevel: string | null
}

export function ParcelMap({ parcels }: { parcels: MapParcel[] }) {
  return (
    <MapContainer center={[20.5, 78.9]} zoom={5} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {parcels.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.latitude, p.longitude]}
          radius={8}
          pathOptions={{
            color: riskColor[p.riskLevel ?? ''] ?? '#64748b',
            fillColor: riskColor[p.riskLevel ?? ''] ?? '#64748b',
            fillOpacity: 0.8,
        }}
        >
          <Popup>
            <strong>{p.surveyNumber}</strong><br />
            Status: {p.status}<br />
            Risk: {p.riskLevel ?? 'Not yet assessed'}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}