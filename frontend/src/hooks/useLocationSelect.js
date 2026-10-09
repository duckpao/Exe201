import { useEffect, useState } from 'react'
import { listProvinces, getProvinceWithWards } from '../services/locationService.js'

// Dropdown Tỉnh/Thành → Phường/Xã (cấu trúc hành chính 2 cấp từ 7/2025).
// Dùng chung cho mọi form đăng bài có địa chỉ.
export function useLocationSelect() {
  const [provinces, setProvinces] = useState([])
  const [provincesLoading, setProvincesLoading] = useState(true)
  const [provincesError, setProvincesError] = useState('')
  const [provincesRetry, setProvincesRetry] = useState(0)
  const [provinceCode, setProvinceCode] = useState('')
  const [wards, setWards] = useState([])
  const [wardsLoading, setWardsLoading] = useState(false)
  const [wardCode, setWardCode] = useState('')

  useEffect(() => {
    let ignore = false
    setProvincesLoading(true)
    setProvincesError('')
    listProvinces()
      .then((data) => {
        if (!ignore) setProvinces(data)
      })
      .catch((err) => {
        if (!ignore) setProvincesError(err.message)
      })
      .finally(() => {
        if (!ignore) setProvincesLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [provincesRetry])

  useEffect(() => {
    if (!provinceCode) {
      setWards([])
      setWardCode('')
      return
    }
    let ignore = false
    setWardsLoading(true)
    setWardCode('')
    getProvinceWithWards(provinceCode)
      .then((data) => {
        if (!ignore) setWards(data.wards || [])
      })
      .catch(() => {
        if (!ignore) setWards([])
      })
      .finally(() => {
        if (!ignore) setWardsLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [provinceCode])

  const selectedProvince = provinces.find((item) => String(item.code) === provinceCode)
  const selectedWard = wards.find((item) => String(item.code) === wardCode)

  // Gắn 4 field địa chỉ vào FormData đúng tên backend đang nhận.
  function appendTo(formData) {
    formData.set('province', selectedProvince?.name || '')
    formData.set('provinceCode', provinceCode)
    formData.set('ward', selectedWard?.name || '')
    formData.set('wardCode', wardCode)
  }

  return {
    provinces,
    provincesLoading,
    provincesError,
    provinceCode,
    setProvinceCode,
    wards,
    wardsLoading,
    wardCode,
    setWardCode,
    selectedProvince,
    selectedWard,
    retryProvinces: () => setProvincesRetry((value) => value + 1),
    appendTo,
  }
}
