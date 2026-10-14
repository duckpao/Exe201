// Video review của bài đăng. controls để người xem tự bấm phát, không tự chạy.
export default function ListingVideo({ src, title }) {
  if (!src) return null
  return (
    <section className="detail-video" aria-label={`Video review ${title}`}>
      <h2>Video review</h2>
      <video className="detail-video-player" src={src} controls preload="metadata" playsInline />
    </section>
  )
}
