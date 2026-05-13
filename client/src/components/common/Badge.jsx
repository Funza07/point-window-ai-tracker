export default function Badge({ children, color }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 10px", borderRadius:99,
      fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
      background:`${color}20`, color, border:`1px solid ${color}50`,
      boxShadow:`0 0 8px ${color}30`,
    }}>{children}</span>
  );
}
