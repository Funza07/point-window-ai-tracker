export default function GenrePill({ genre }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 8px", borderRadius:4,
      fontSize:10, color:"#9d8aac", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)"
    }}>{genre}</span>
  );
}
