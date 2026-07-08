import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
          borderRadius: "50%",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#d97706",
            lineHeight: 1,
          }}
        >
          $
        </span>
      </div>
    ),
    { ...size }
  );
}
