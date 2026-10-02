export default function Corner({ pos }) {
  return (
    <svg className={`corner corner-${pos}`} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M2 46V2h44M2 22h20v24M22 22V12" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
