export default function StarRating({ value }) {
  return (
    <span style={{ color:"#fbbf24", fontSize:12, letterSpacing:1 }}>
      {"★".repeat(Math.round(value / 2))}{"☆".repeat(5 - Math.round(value / 2))}
      <span style={{ color:"#8a7898", marginLeft:5, fontSize:11 }}>{value}</span>
    </span>
  );
}
