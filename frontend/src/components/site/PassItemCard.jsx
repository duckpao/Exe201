import { Link } from 'react-router-dom'
import PlaceholderImage from './PlaceholderImage.jsx'

export default function PassItemCard({ item }) {
  return (
    <article className="pass-room-card">
      <div className="pass-room-card-image-wrap">
        <PlaceholderImage src={item.image} alt={item.title} className="pass-room-card-image" />
        <span className={`pass-room-status ${item.status === 'Cần bán gấp' ? 'urgent' : ''}`}>{item.status}</span>
      </div>
      <div className="pass-room-card-body">
        <h3 className="pass-room-card-title">{item.title}</h3>
        <p className="pass-room-card-price">{item.price}</p>
        <p className="pass-room-card-meta">
          {item.category} | {item.location}
        </p>
        <Link to={`/pass-do/${item.id}`} className="btn btn-primary pass-room-card-cta">
          Xem chi tiết
        </Link>
      </div>
    </article>
  )
}
