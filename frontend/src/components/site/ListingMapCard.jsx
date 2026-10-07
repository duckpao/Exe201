import { useEffect, useRef } from 'react'
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css'

const tileKey = import.meta.env.VITE_VIETMAP_TILE_KEY

export default function ListingMapCard({ title, address, latitude, longitude, compact = false }) {
  const mapContainer = useRef(null)
  const lat = Number(latitude)
  const lng = Number(longitude)
  const hasCoords = latitude != null && longitude != null && Number.isFinite(lat) && Number.isFinite(lng)

  useEffect(() => {
    if (!mapContainer.current || !tileKey || !hasCoords) return undefined

    let map
    let disposed = false

    import('@vietmap/vietmap-gl-js/dist/vietmap-gl').then(({ default: vietmapgl }) => {
      if (disposed || !mapContainer.current) return

      map = new vietmapgl.Map({
        container: mapContainer.current,
        style: `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${encodeURIComponent(tileKey)}`,
        center: [lng, lat],
        zoom: 15,
      })

      map.addControl(new vietmapgl.NavigationControl(), 'top-right')
      new vietmapgl.Marker().setLngLat([lng, lat]).addTo(map)
    })

    return () => {
      disposed = true
      map?.remove()
    }
  }, [hasCoords, lat, lng])

  return (
    <div className={compact ? 'address-card address-card-compact' : 'sidebar-card address-card'}>
      {!compact && <p className="address-card-title">Địa chỉ</p>}
      {address && <p className="address-card-text">{address}</p>}
      {hasCoords && tileKey ? (
        <div
          ref={mapContainer}
          className="map-embed"
          role="img"
          aria-label={`Bản đồ VietMap vị trí ${title}`}
        />
      ) : (
        <div className="map-placeholder">
          {hasCoords ? 'Chưa cấu hình VietMap Tile API key' : 'Chưa có tọa độ vị trí'}
        </div>
      )}
      {hasCoords && (
        <a
          className="btn btn-outline map-directions-link"
          href={`https://maps.vietmap.vn/?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&zoom=17`}
          target="_blank"
          rel="noreferrer"
        >
          Mở bản đồ lớn
        </a>
      )}
    </div>
  )
}
