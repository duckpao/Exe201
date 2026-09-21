import PlaceholderImage from './PlaceholderImage.jsx'

export default function PassRoomCard({ room }) {
  return (
    <article className="pass-room-card">
      <div className="pass-room-card-image-wrap">
        <PlaceholderImage src={room.image} alt={room.title} className="pass-room-card-image" />
        <span className={`pass-room-status ${room.status === 'Cần pass gấp' ? 'urgent' : ''}`}>{room.status}</span>
      </div>
      <div className="pass-room-card-body">
        <h3 className="pass-room-card-title">{room.title}</h3>
        <p className="pass-room-card-price">{room.price}</p>
        <p className="pass-room-card-meta">
          {room.area} | {room.location}
        </p>
        <button type="button" className="btn btn-primary pass-room-card-cta">
          Xem chi tiết
        </button>
      </div>
    </article>
  )
}
