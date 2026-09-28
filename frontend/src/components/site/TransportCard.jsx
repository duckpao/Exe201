import { Link } from 'react-router-dom'
import PlaceholderImage from './PlaceholderImage.jsx'

export default function TransportCard({ service }) {
  return (
    <article className="transport-card">
      <Link to={`/van-chuyen-do/${service.id}`}>
        <PlaceholderImage src={service.image} alt={service.title} className="transport-card-image" />
      </Link>
      <div className="transport-card-body">
        <h3 className="transport-card-title">
          <Link to={`/van-chuyen-do/${service.id}`}>{service.title}</Link>
        </h3>
        <p className="transport-card-rating">⭐ {service.rating || 'Chưa có đánh giá'}</p>
        <div className="transport-card-tags">
          {(service.tags || []).map((tag) => (
            <span key={tag} className="transport-card-tag">
              {tag}
            </span>
          ))}
        </div>
        <p className="transport-card-price">{service.price || 'Liên hệ để báo giá'}</p>
        <Link to={`/van-chuyen-do/${service.id}`} className="btn btn-primary transport-card-cta">
          Xem chi tiết
        </Link>
      </div>
    </article>
  )
}
