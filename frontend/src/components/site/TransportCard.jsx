import PlaceholderImage from './PlaceholderImage.jsx'

export default function TransportCard({ service }) {
  return (
    <article className="transport-card">
      <PlaceholderImage src={service.image} alt={service.title} className="transport-card-image" />
      <div className="transport-card-body">
        <h3 className="transport-card-title">{service.title}</h3>
        <p className="transport-card-rating">⭐ {service.rating}</p>
        <div className="transport-card-tags">
          {service.tags.map((tag) => (
            <span key={tag} className="transport-card-tag">
              {tag}
            </span>
          ))}
        </div>
        <p className="transport-card-price">{service.price}</p>
        <button type="button" className="btn btn-primary transport-card-cta">
          Đặt Ngay
        </button>
      </div>
    </article>
  )
}
