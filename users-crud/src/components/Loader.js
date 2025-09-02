"use client";

export default function Loader({ fullscreen = false, text = "Loading..." }) {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center ${
        fullscreen ? "vh-100" : "my-4"
      }`}
    >
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <p className="mt-3 text-muted">{text}</p>}
    </div>
  );
}
