export default function PrimaryButton({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}