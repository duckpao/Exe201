import PlaceholderImage from './PlaceholderImage.jsx'

export default function RoommateCard({ roommate }) {
  return (
    <article className="roommate-card">
      <PlaceholderImage src={roommate.avatar} alt={roommate.name} className="roommate-card-avatar" />
      <div className="roommate-card-body">
        <h3 className="roommate-card-name">
          {roommate.name} <span>· {roommate.age} tuổi · {roommate.gender}</span>
        </h3>
        <p className="roommate-card-desc">{roommate.description}</p>
        <p className="roommate-card-price">{roommate.price}</p>
        <p className="roommate-card-date">Đăng ngày {roommate.date}</p>
      </div>
      <button type="button" className="btn btn-primary roommate-card-call">
        Gọi
      </button>
    </article>
  )
}
