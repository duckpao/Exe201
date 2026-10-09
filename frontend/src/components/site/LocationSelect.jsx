// Cặp dropdown Tỉnh/Thành + Phường/Xã, nhận state từ hook useLocationSelect.
function LocationSelect({ location, required = true }) {
  const {
    provinces,
    provincesLoading,
    provincesError,
    provinceCode,
    setProvinceCode,
    wards,
    wardsLoading,
    wardCode,
    setWardCode,
    retryProvinces,
  } = location

  return (
    <>
      <div className="form-row form-row-split">
        <label>
          Tỉnh / Thành phố
          <select
            value={provinceCode}
            onChange={(event) => setProvinceCode(event.target.value)}
            required={required}
            disabled={provincesLoading}
          >
            <option value="" disabled>
              {provincesLoading ? 'Đang tải...' : 'Chọn tỉnh/thành'}
            </option>
            {provinces.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Phường / Xã
          <select
            value={wardCode}
            onChange={(event) => setWardCode(event.target.value)}
            required={required}
            disabled={!provinceCode || wardsLoading}
          >
            <option value="" disabled>
              {wardsLoading ? 'Đang tải...' : 'Chọn phường/xã'}
            </option>
            {wards.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {provincesError && (
        <div className="notice-box info">
          Không tải được danh sách tỉnh/thành.{' '}
          <button type="button" onClick={retryProvinces}>
            Thử lại
          </button>
        </div>
      )}
    </>
  )
}

export default LocationSelect
