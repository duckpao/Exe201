import { Link } from 'react-router-dom'
import PlaceholderImage from './PlaceholderImage.jsx'

export default function RoommateCard({ roommate }) {
  return (
    <article className="roommate-card">
      <Link to={`/tim-roommate/${roommate.id}`}>
        <PlaceholderImage src={roommate.avatar} alt={roommate.name} className="roommate-card-avatar" />
      </Link>
      <div className="roommate-card-body">
        <h3 className="roommate-card-name">
          <Link to={`/tim-roommate/${roommate.id}`}>{roommate.name}</Link>{' '}
          <span>
            {roommate.age ? `· ${roommate.age} tuổi ` : ''}· {roommate.gender}
          </span>
        </h3>
        <p className="roommate-card-desc">{roommate.description}</p>
        <p className="roommate-card-price">{roommate.price || 'Chưa có ngân sách'}</p>
        <p className="roommate-card-date">Đăng ngày {roommate.date}</p>
      </div>
      <Link to={`/tim-roommate/${roommate.id}`} className="btn btn-primary roommate-card-call">
        Xem chi tiết
      </Link>
    </article>
  )
}
