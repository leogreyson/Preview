// WavyLineBackground.tsx
const WavyLineBackground = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 1440 800"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
      pointerEvents: "none",
      opacity: 0.92, // lower if you want even lighter lines
    }}
  >
    {/* Top long wave */}
    <path
      d="M0 110 Q300 40 600 120 Q900 200 1440 80"
      stroke="#c5beb7"
      strokeWidth="2.2"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M0 160 Q350 80 700 145 Q1150 210 1440 120"
      stroke="#d4ccc2"
      strokeWidth="1.5"
      fill="none"
      opacity="0.5"
    />

    {/* Bottom long wave */}
    <path
      d="M0 700 Q370 790 700 710 Q1100 630 1440 760"
      stroke="#c5beb7"
      strokeWidth="2"
      fill="none"
      opacity="0.75"
    />
    <path
      d="M0 730 Q420 800 800 730 Q1200 650 1440 790"
      stroke="#d4ccc2"
      strokeWidth="1.2"
      fill="none"
      opacity="0.4"
    />

    {/* Left floral/leaf */}
    <path
      d="M70 340 Q50 410 100 470 Q170 570 140 680"
      stroke="#c5beb7"
      strokeWidth="1.7"
      fill="none"
      opacity="0.4"
    />
    <path
      d="M120 440 Q110 530 170 590 Q210 630 170 710"
      stroke="#d4ccc2"
      strokeWidth="1.1"
      fill="none"
      opacity="0.32"
    />

    {/* Right floral/leaf */}
    <path
      d="M1390 350 Q1410 430 1360 500 Q1300 590 1330 700"
      stroke="#c5beb7"
      strokeWidth="1.7"
      fill="none"
      opacity="0.4"
    />
    <path
      d="M1350 450 Q1360 530 1300 600 Q1270 660 1320 750"
      stroke="#d4ccc2"
      strokeWidth="1.1"
      fill="none"
      opacity="0.32"
    />

    {/* (Optional) Extra subtle waves for richness */}
    <path
      d="M0 400 Q700 350 1440 400"
      stroke="#e7e2da"
      strokeWidth="1"
      fill="none"
      opacity="0.15"
    />
    <path
      d="M0 450 Q700 470 1440 450"
      stroke="#e7e2da"
      strokeWidth="1"
      fill="none"
      opacity="0.18"
    />
  </svg>
);

export default WavyLineBackground;
