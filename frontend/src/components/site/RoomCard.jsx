import { Link } from 'react-router-dom'
import PlaceholderImage from './PlaceholderImage.jsx'
import AvailabilityRibbon from './AvailabilityRibbon.jsx'

export default function RoomCard({ room }) {
  return (
    <Link to={`/phong-tro/${room.id}`} className="room-card">
      <div className="room-card-media">
        <PlaceholderImage src={room.image} alt={room.title} className="room-card-image" />
        <AvailabilityRibbon available={room.available} />
      </div>
      <div className="room-card-body">
        <h3 className="room-card-title">{room.title}</h3>
        <p className="room-card-price">{room.price}</p>
        <p className="room-card-meta">
          {room.area} | {room.location}
        </p>
        <span className="room-card-tag">{room.tag}</span>
      </div>
    </Link>
  )
}
