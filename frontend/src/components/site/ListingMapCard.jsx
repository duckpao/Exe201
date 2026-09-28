// Khối "Địa chỉ" dùng chung cho các trang chi tiết bài đăng.
// Khi VITE_GOOGLE_MAPS_EMBED_KEY còn trống thì tự fallback về placeholder,
// nhưng link "Xem Map" (không cần API key) vẫn dùng được nếu có toạ độ.
const embedKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY

export default function ListingMapCard({ title, latitude, longitude }) {
  const hasCoords = latitude != null && longitude != null

  return (
    <div className="sidebar-card address-card">
      <p className="address-card-title">Địa chỉ</p>
      {hasCoords && embedKey ? (
        <iframe
          className="map-embed"
          src={`https://www.google.com/maps/embed/v1/place?key=${embedKey}&q=${latitude},${longitude}&zoom=16`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Bản đồ vị trí ${title}`}
        />
      ) : (
        <div className="map-placeholder">Bản đồ Google Map</div>
      )}
      {hasCoords ? (
        <a
          className="btn btn-outline"
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noreferrer"
        >
          Xem Map
        </a>
      ) : (
        <button type="button" className="btn btn-outline" disabled>
          Xem Map
        </button>
      )}
    </div>
  )
}
