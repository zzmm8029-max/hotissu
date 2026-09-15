/**
 * 약식 지도(schematic base map).
 *
 * 외부 타일 서버를 전혀 쓸 수 없을 때 지도 배경 자리에 까는 그림이다. 실제 지형이 아니라
 * "여기는 지도다"라는 것만 알아보게 하는 도식이라, 도로명·지명·실제 하천 경로는 그리지 않는다.
 * 가맹점 핀은 이 그림과 무관하게 실제 좌표에 찍히고, 화면에는 '약식 지도' 배지를 함께 띄운다.
 *
 * 외부 파일을 받아오지 않도록 SVG를 코드에서 만들어 data URL로 넘긴다.
 */

const SIZE = 1000;
const CELL = 52;

const COLOR = {
  land: "#eceef2",
  block: "#dfe3e9",
  blockAlt: "#e6e9ee",
  park: "#dce8da",
  water: "#c8dbeb",
  road: "#ffffff",
};

/** 고정 시드 난수 — 새로고침할 때마다 그림이 바뀌지 않도록 한다. */
function seeded(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** 물줄기 중심선. 도식이라 실제 하천이 아니라 완만한 곡선 하나로 둔다. */
function waterCenterX(y: number) {
  return 280 + 0.46 * y + 70 * Math.sin(y / 190);
}

const PARKS = [
  { x: 175, y: 790, r: 72 },
  { x: 855, y: 225, r: 60 },
  { x: 640, y: 560, r: 44 },
];

function buildSvg() {
  const rand = seeded(20260915);
  const blocks: string[] = [];

  for (let cy = 0; cy < SIZE; cy += CELL) {
    for (let cx = 0; cx < SIZE; cx += CELL) {
      const midX = cx + CELL / 2;
      const midY = cy + CELL / 2;

      // 물줄기와 공원이 지나가는 칸은 건물 블록을 비운다
      if (Math.abs(midX - waterCenterX(midY)) < 46) continue;
      if (PARKS.some((p) => Math.hypot(midX - p.x, midY - p.y) < p.r + 14)) continue;

      // 한 칸을 통째로 쓰거나 둘로 쪼개서, 격자가 너무 반듯해 보이지 않게 한다
      const inset = 5 + rand() * 3.5;
      const w = CELL - inset * 2;
      const h = CELL - inset * 2;
      const fill = rand() > 0.5 ? COLOR.block : COLOR.blockAlt;

      if (rand() > 0.62) {
        const split = h * (0.38 + rand() * 0.24);
        blocks.push(
          `<rect x="${(cx + inset).toFixed(1)}" y="${(cy + inset).toFixed(1)}" width="${w.toFixed(1)}" height="${split.toFixed(1)}" rx="3" fill="${fill}"/>`,
          `<rect x="${(cx + inset).toFixed(1)}" y="${(cy + inset + split + 4).toFixed(1)}" width="${w.toFixed(1)}" height="${(h - split - 4).toFixed(1)}" rx="3" fill="${COLOR.blockAlt}"/>`,
        );
      } else {
        blocks.push(
          `<rect x="${(cx + inset).toFixed(1)}" y="${(cy + inset).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${fill}"/>`,
        );
      }
    }
  }

  // 물줄기를 몇 개 점으로 이어 그린다
  const waterPoints: string[] = [];
  for (let y = -60; y <= SIZE + 60; y += 30) {
    waterPoints.push(`${waterCenterX(y).toFixed(1)},${y}`);
  }

  const parks = PARKS.map(
    (p) => `<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="${COLOR.park}"/>`,
  ).join("");

  // 큰길 두 개. 블록 사이 틈이 이미 골목처럼 보이므로 굵은 길만 얹는다
  const roads = [
    `<path d="M -40 300 L 1040 372" stroke="${COLOR.road}" stroke-width="10" fill="none"/>`,
    `<path d="M 430 -40 L 372 1040" stroke="${COLOR.road}" stroke-width="10" fill="none"/>`,
    `<path d="M -40 720 L 1040 660" stroke="${COLOR.road}" stroke-width="8" fill="none"/>`,
  ].join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" preserveAspectRatio="none">
<rect width="${SIZE}" height="${SIZE}" fill="${COLOR.land}"/>
${parks}
${blocks.join("")}
${roads}
<polyline points="${waterPoints.join(" ")}" fill="none" stroke="${COLOR.water}" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

let cached: string | null = null;

/** 약식 지도 SVG의 data URL. 한 번 만들고 재사용한다. */
export function schematicBaseMapUrl() {
  if (cached === null) {
    cached = `data:image/svg+xml;utf8,${encodeURIComponent(buildSvg())}`;
  }
  return cached;
}
