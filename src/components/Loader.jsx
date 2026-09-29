function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "3px solid var(--surface-2)",
          borderTop: "3px solid var(--accent)",
          borderRadius: "50%",
          animation: "spinSlow 1s linear infinite",
        }}
      />
    </div>
  );
}

export default Loader;
