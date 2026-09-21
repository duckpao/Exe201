import PlaceholderImage from './PlaceholderImage.jsx'

export default function RoomCard({ room }) {
  return (
    <article className="room-card">
      <PlaceholderImage src={room.image} alt={room.title} className="room-card-image" />
      <div className="room-card-body">
        <h3 className="room-card-title">{room.title}</h3>
        <p className="room-card-price">{room.price}</p>
        <p className="room-card-meta">
          {room.area} | {room.location}
        </p>
        <span className="room-card-tag">{room.tag}</span>
      </div>
    </article>
  )
}
