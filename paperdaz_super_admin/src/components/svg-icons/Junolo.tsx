import React from "react";
import { useLocation } from "react-router-dom";
const Junolo = () => {
  const location = useLocation();
  const active = location.pathname === "/JunologixReports";

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="37"
        height="37"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill={active ? "white" : "#707070"} // Conditionally set fill color
          stroke="##707070"
          strokeWidth="1"
        >
          <path d="M610 4311 c-69 -21 -130 -73 -166 -141 -18 -33 -19 -74 -19 -845 0 -903 -5 -835 69 -913 63 -68 92 -76 286 -82 l175 -5 2 -260 2 -260 31 -27 c36 -33 83 -37 120 -11 14 10 171 140 349 290 l324 273 203 0 203 0 3 -432 3 -433 28 -50 c31 -57 82 -102 136 -121 27 -10 156 -13 538 -14 l501 0 34 -27 c18 -15 35 -30 38 -33 8 -9 562 -473 594 -498 39 -30 96 -29 133 2 l28 24 3 266 3 266 167 0 c155 0 171 2 217 24 60 28 97 66 124 126 20 44 21 62 21 835 0 546 -4 802 -11 830 -7 26 -29 58 -63 91 -87 88 -45 84 -927 84 l-768 0 -3 438 c-3 490 0 465 -80 542 -75 73 -15 70 -1207 69 -586 0 -1077 -4 -1091 -8z m2164 -209 c16 -19 19 -276 16 -1464 0 -56 -4 -81 -16 -92 -14 -14 -76 -16 -532 -16 -487 0 -519 -1 -547 -19 -16 -10 -142 -113 -280 -230 -137 -116 -253 -211 -257 -211 -4 0 -8 88 -8 196 0 121 -4 203 -11 216 -22 40 -66 48 -280 48 -174 0 -205 2 -221 17 -17 15 -18 53 -18 776 0 694 1 762 17 779 15 17 62 18 1068 18 1011 0 1053 -1 1069 -18z m1772 -1053 c18 -20 19 -49 22 -768 2 -592 -1 -751 -11 -771 l-13 -25 -219 -5 c-309 -7 -295 6 -295 -267 0 -106 -3 -193 -6 -193 -3 0 -125 99 -269 221 -159 132 -277 224 -297 230 -19 5 -248 9 -532 9 -451 0 -501 2 -518 17 -17 15 -18 42 -18 425 l0 408 194 0 c210 0 247 7 312 56 19 15 47 48 62 73 l27 46 3 283 3 282 768 0 c768 0 768 0 787 -21z" />
          <path d="M1523 3886 c-170 -55 -293 -179 -350 -351 -22 -68 -26 -98 -26 -200 -1 -105 3 -130 27 -200 34 -100 70 -157 144 -227 158 -151 415 -190 619 -94 l71 34 22 -23 c39 -42 102 -69 142 -61 42 8 98 55 98 83 0 10 -27 45 -59 77 l-59 58 39 72 c21 39 45 98 53 131 20 75 20 230 1 313 -46 196 -191 346 -385 397 -88 24 -250 19 -337 -9z m332 -202 c71 -35 137 -107 167 -182 30 -77 33 -252 4 -325 l-18 -49 -92 90 c-103 101 -130 113 -181 82 -36 -22 -45 -38 -45 -79 0 -35 18 -61 107 -152 l75 -76 -34 -14 c-21 -9 -69 -14 -133 -14 -90 0 -105 3 -152 28 -72 37 -120 88 -157 166 -29 62 -31 73 -31 181 0 103 3 121 26 171 31 65 85 129 137 161 90 56 227 61 327 12z" />
          <path d="M3403 2829 c-18 -5 -40 -20 -48 -33 -26 -40 -395 -1000 -393 -1020 5 -33 54 -61 108 -61 72 0 95 27 155 185 l50 130 200 -2 200 -3 47 -125 c55 -142 83 -179 145 -187 44 -6 116 24 127 52 3 10 -39 132 -101 288 -58 150 -147 377 -197 506 -69 178 -97 239 -117 253 -31 23 -127 32 -176 17z m135 -424 c33 -88 64 -168 67 -177 7 -17 -3 -18 -129 -18 -75 0 -136 4 -136 9 0 4 24 73 54 152 77 203 76 202 80 198 2 -2 31 -76 64 -164z" />
        </g>
      </svg>
    </div>
  );
};

export default Junolo;
