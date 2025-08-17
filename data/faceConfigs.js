// src/data/faceConfigs.js

// ===== Basis-Template =====
const BASE_FACE = {
  eyeLeft: { cx: 63, cy: 53, r: 2.5 },
  eyeRight: { cx: 77, cy: 53, r: 2.5 },
  nose: { cx: 70, cy: 57, r: 1.5 },
  mouth: {
    mx1: 62,
    mx2: 78,
    mcx: 70,
    my: 60,
    mcy: 66,
    mcy2: 56,
    my2: 62,
  },
  brows: {
    bx1: 60,
    bx2: 64,
    bx1c: 62,
    bx3: 76,
    bx4: 80,
    bx3c: 78,
    by: 49,
    byc: 47,
    by2: 48,
    byc2: 45,
  },
};

// ===== Klassen-spezifische Varianten =====
const faceConfigs = {
  Berserker: {
    ...BASE_FACE,
    eyeLeft: { ...BASE_FACE.eyeLeft, cx: 62, cy: 52, r: 3.2 },
    eyeRight: { ...BASE_FACE.eyeRight, cx: 78, cy: 52, r: 3.2 },
    nose: { ...BASE_FACE.nose, cy: 58, r: 2 },
    brows: { ...BASE_FACE.brows, by: 48, byc: 46, by2: 47 }, // wütender Look
    mouth: { ...BASE_FACE.mouth, my: 61, mcy: 67 }, // leicht geöffnet
  },

  Mage: {
    ...BASE_FACE,
    eyeLeft: { ...BASE_FACE.eyeLeft, cx: 61, cy: 54, r: 2.2 },
    eyeRight: { ...BASE_FACE.eyeRight, cx: 79, cy: 54, r: 2.2 },
    nose: { ...BASE_FACE.nose, cy: 58 },
    brows: { ...BASE_FACE.brows, by: 50, byc: 48 }, // ruhiger, hochgezogen
    mouth: { ...BASE_FACE.mouth, my: 62, mcy: 68 }, // geheimnisvolles Lächeln
  },

  Assassin: {
    ...BASE_FACE,
    eyeLeft: { ...BASE_FACE.eyeLeft, cx: 62, cy: 52, r: 2 },
    eyeRight: { ...BASE_FACE.eyeRight, cx: 78, cy: 52, r: 2 },
    nose: { ...BASE_FACE.nose, cy: 57, r: 1.2 },
    brows: {
      ...BASE_FACE.brows,
      by: 47,
      byc: 44,
      by2: 46,
      byc2: 43,
    }, // schräge Augenbrauen → aggressiver Blick
    mouth: { ...BASE_FACE.mouth, my: 61, mcy: 63 }, // neutraler Mund
  },

  Ranger: {
    ...BASE_FACE,
    eyeLeft: { ...BASE_FACE.eyeLeft, cx: 63, cy: 53, r: 2.6 },
    eyeRight: { ...BASE_FACE.eyeRight, cx: 77, cy: 53, r: 2.6 },
    nose: { ...BASE_FACE.nose, cy: 58, r: 1.6 },
    brows: { ...BASE_FACE.brows, by: 50, byc: 48 }, // entspannt
    mouth: { ...BASE_FACE.mouth, my: 59, mcy: 65 }, // leicht fröhlich
  },

  Paladin: {
    ...BASE_FACE,
    eyeLeft: { ...BASE_FACE.eyeLeft, r: 3, cy: 53 },
    eyeRight: { ...BASE_FACE.eyeRight, r: 3, cy: 53 },
    nose: { ...BASE_FACE.nose, r: 1.8 },
    brows: { ...BASE_FACE.brows, by: 50, byc: 49, by2: 49 }, // sanftere Form
    mouth: { ...BASE_FACE.mouth, my: 60, mcy: 64 }, // freundlicher Ausdruck
  },

  Necromancer: {
    ...BASE_FACE,
    eyeLeft: { ...BASE_FACE.eyeLeft, r: 2, cy: 54 },
    eyeRight: { ...BASE_FACE.eyeRight, r: 2, cy: 54 },
    nose: { ...BASE_FACE.nose, r: 1, cy: 58 },
    brows: { ...BASE_FACE.brows, by: 48, byc: 46, by2: 47 }, // böser Blick
    mouth: { ...BASE_FACE.mouth, my: 63, mcy: 63, my2: 63 }, // gerade Linie → emotionslos
  },
};

export default faceConfigs;
