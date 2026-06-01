// components/MessageModal.tsx

type Props = {
    open: boolean
    message: string
    onClose: () => void
  }
  
  export function MessageModal({ open, message, onClose }: Props) {
    if (!open) return null
  
    return (
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
            width: "500px",
            maxWidth: "90%",
          }}>
          <h3 style={{ marginBottom: "0.5rem" }}>Message</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
  
          <button
            onClick={onClose}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}>
            Close
          </button>
        </div>
      </div>
    )
  }