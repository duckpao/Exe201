// Nhãn chéo ở góc trái trên của ảnh. Xanh = còn phòng, đỏ = hết phòng.
// Chữ luôn hiện để người không phân biệt được màu vẫn đọc được trạng thái.
export default function AvailabilityRibbon({ available }) {
  return (
    <span className={`availability-ribbon ${available ? 'is-available' : 'is-full'}`}>
      {available ? 'Còn phòng' : 'Hết phòng'}
    </span>
  )
}
