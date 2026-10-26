import { useEffect, useRef } from 'react'
import { IconClose, IconSuccess } from './Icons'

export default function CommitCreatedModal({ onClose }) {
  const modalRef   = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    closeBtnRef.current?.focus()

    function handleKeyDown(e) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last  = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus() }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-wrap">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <IconClose size={12} />
        </button>

        <div className="modal-container" ref={modalRef} tabIndex={-1}>
          <div className="modal-header">
            <h2 id="modal-title">Commit created</h2>
          </div>

          <div className="modal-body" id="modal-desc">
            <div className="modal-success-banner" role="status">
              <IconSuccess size={18} />
              Your commit has been created and saved as a Draft.
            </div>
            <p>
              AEs and Sales Ops can edit this commit while it's a draft. Once it's Active, only Sales Ops can edit it.
            </p>
          </div>

          <div className="modal-footer">
            <button
              ref={closeBtnRef}
              className="slds-button slds-button_brand"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
