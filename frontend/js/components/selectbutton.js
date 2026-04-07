export default function SelectButton({ label, onClick }) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  )
}