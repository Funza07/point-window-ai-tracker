export default function HScrollRow({ children, gap = 12, className = "", style = {} }) {
  return (
    <div
      className={`hide-scrollbar ${className}`.trim()}
      style={{
        display: "flex",
        gap,
        overflowX: "auto",
        overflowY: "hidden",
        maxWidth: "100%",
        boxSizing: "border-box",
        WebkitOverflowScrolling: "touch",
        scrollSnapType: "x proximity",
        paddingBottom: 2,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
