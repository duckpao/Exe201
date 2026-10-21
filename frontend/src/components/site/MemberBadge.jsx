const TIER_LABELS = { basic: 'Cơ bản', pro: 'Nâng cao' }

// Nhãn thành viên trả phí. Gói năm đổi sang màu vàng; chỉ có chữ, không icon.
export default function MemberBadge({ member }) {
  if (!member) return null
  const cycleLabel = member.cycle === 'yearly' ? 'gói năm' : 'gói tháng'
  return (
    <span
      className={`member-badge member-badge-${member.tier} ${member.cycle === 'yearly' ? 'is-yearly' : ''}`}
      title={`Thành viên ${TIER_LABELS[member.tier]} (${cycleLabel})`}
    >
      {TIER_LABELS[member.tier]}
    </span>
  )
}
