import { useEffect, useState } from 'react'
import { autocompleteAddress, getAddressPlace } from '../../services/mapService.js'

export default function AddressAutocomplete({ value, onChange, onSelect, locationHint }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const query = [value, locationHint].filter(Boolean).join(', ').trim()
    if (value.trim().length < 2) {
      setSuggestions([])
      return undefined
    }
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setLoading(true)
      setError('')
      autocompleteAddress(query, controller.signal)
        .then(setSuggestions)
        .catch((err) => {
          if (err.name !== 'AbortError') setError(err.message)
        })
        .finally(() => setLoading(false))
    }, 350)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [value, locationHint])

  async function selectSuggestion(suggestion) {
    setLoading(true)
    setError('')
    try {
      const place = await getAddressPlace(suggestion.refId)
      onChange(place.name || suggestion.name || value)
      onSelect(place)
      setSuggestions([])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="address-autocomplete">
      <input
        type="text"
        placeholder="Nhập số nhà, tên đường hoặc tên địa điểm"
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
          onSelect(null)
        }}
        autoComplete="off"
      />
      {loading && <span className="address-autocomplete-status">Đang tìm trên VietMap...</span>}
      {error && <span className="address-autocomplete-error">{error}</span>}
      {suggestions.length > 0 && (
        <div className="address-suggestions" role="listbox">
          {suggestions.map((suggestion) => (
            <button key={suggestion.refId} type="button" onClick={() => selectSuggestion(suggestion)}>
              <strong>{suggestion.name}</strong>
              <span>{suggestion.address || suggestion.display}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}