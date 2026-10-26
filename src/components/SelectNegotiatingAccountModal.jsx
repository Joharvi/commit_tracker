import { useState, useEffect, useRef } from 'react'
import { IconSearch, IconClose } from './Icons'
import { PLACEHOLDER_ACCOUNTS } from '../data/commitData'

export default function SelectNegotiatingAccountModal({ isOpen, onClose, onSelect, currentValue }) {
  const [query, setQuery] = useState('')
  const [pendingId, setPendingId] = useState(null)
  const searchRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      const match = PLACEHOLDER_ACCOUNTS.find(a => a.name === currentValue)
      setPendingId(match ? match.id : null)
      const t = setTimeout(() => searchRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [isOpen, currentValue])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const q = query.trim().toLowerCase()
  const filtered = q
    ? PLACEHOLDER_ACCOUNTS.filter(a => a.name.toLowerCase().startsWith(q))
    : PLACEHOLDER_ACCOUNTS

  const pendingAccount = PLACEHOLDER_ACCOUNTS.find(a => a.id === pendingId)

  function handleSelect() {
    if (pendingAccount) {
      onSelect(pendingAccount.name)
      onClose()
    }
  }

  function handleDeselect() {
    onSelect(null)
    onClose()
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="lnm-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lnm-title"
    >
      <div className="lnm-wrap">
        <button className="lnm-close" onClick={onClose} aria-label="Close dialog">
          <IconClose size={14} />
        </button>

        <div className="lnm-card">
          <header className="lnm-header">
            <div>
              <h2 className="lnm-title" id="lnm-title">Select Negotiating Account</h2>
              <p className="lnm-subtitle">Choose the account that will negotiate the commit</p>
            </div>
          </header>

          <div className="lnm-body">
            <div className="lnm-search-wrap">
              <span className="lnm-search-icon" aria-hidden="true"><IconSearch size={16} /></span>
              <input
                ref={searchRef}
                type="search"
                className="lnm-search"
                placeholder="Search accounts..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Search accounts"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="lnm-empty">
                <h3 className="lnm-empty-title">No matching accounts</h3>
                <p className="lnm-empty-body">Try a different search term.</p>
              </div>
            ) : (
              <>
                <p className="lnm-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''} &bull; Sorted by Account Name</p>
                <div className="lnm-table-wrap">
                  <table className="lnm-table" aria-label="Account list">
                    <thead>
                      <tr>
                        <th className="lnm-col-select" aria-label="Select"></th>
                        <th>Account Name</th>
                        <th>Account Name (Local)</th>
                        <th>D&amp;B DUNS</th>
                        <th>Ultimate Parent</th>
                        <th>Country</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(a => {
                        const sel = pendingId === a.id
                        return (
                          <tr
                            key={a.id}
                            className={sel ? 'lnm-row--selected' : ''}
                            onClick={() => setPendingId(a.id)}
                          >
                            <td className="lnm-col-select">
                              <input
                                type="radio"
                                name="lnm-account"
                                checked={sel}
                                onChange={() => setPendingId(a.id)}
                                aria-label={`Select ${a.name}`}
                              />
                            </td>
                            <td className="lnm-col-name">{a.name}</td>
                            <td className={a.accountNameLocal === 'none' ? 'lnm-col-none' : ''}>{a.accountNameLocal !== 'none' ? a.accountNameLocal : '—'}</td>
                            <td className={a.uduns === 'none' ? 'lnm-col-none' : ''}>{a.uduns !== 'none' ? a.uduns : '—'}</td>
                            <td className={a.globalCompany === 'none' ? 'lnm-col-none' : ''}>{a.globalCompany !== 'none' ? a.globalCompany : '—'}</td>
                            <td className={a.countryCode === 'none' ? 'lnm-col-none' : ''}>{a.countryCode !== 'none' ? a.countryCode : '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          <footer className="lnm-footer">
            {currentValue && (
              <button className="slds-button slds-button_neutral lnm-deselect" onClick={handleDeselect}>
                Deselect
              </button>
            )}
            <button className="slds-button slds-button_neutral lnm-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="slds-button slds-button_brand"
              disabled={!pendingId}
              onClick={handleSelect}
            >
              Select Account
            </button>
          </footer>
        </div>
      </div>
    </div>
  )
}
