import sharp from 'sharp';

const items = [
  ['Night Sky zip-up (Black)1.webp', 'space-night-black.webp'],
  ['Night Sky zip-up (Black).webp', 'space-night-black-back.webp'],
  ['Morning Sky zip-up (Teal)1.webp', 'space-morning-teal.webp'],
  ['Morning Sky zip-up (Teal).webp', 'space-morning-teal-back.webp'],
  ['Dawn Sky zip-up (Night Blue)1.webp', 'space-dawn-blue.webp'],
  ['Dawn Sky zip-up (Night Blue).webp', 'space-dawn-blue-back.webp'],
  ['Red Sky zip-up (Red)1.webp', 'space-red.webp'],
  ['Red Sky zip-up (Red).webp', 'space-red-back.webp']
];

function isBackground(pixels, index) {
  const offset = index * 4;
  return pixels[offset] > 224 && pixels[offset + 1] > 224 && pixels[offset + 2] > 224;
}

async function removeConnectedWhiteBackground(source, destination) {
  const image = sharp(source).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const seen = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const add = (pixel) => {
    if (seen[pixel] || !isBackground(data, pixel)) return;
    seen[pixel] = 1;
    queue[tail++] = pixel;
  };

  for (let x = 0; x < width; x++) { add(x); add((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { add(y * width); add(y * width + width - 1); }
  while (head < tail) {
    const pixel = queue[head++];
    data[pixel * 4 + 3] = 0;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (x) add(pixel - 1);
    if (x < width - 1) add(pixel + 1);
    if (y) add(pixel - width);
    if (y < height - 1) add(pixel + width);
  }
  await sharp(data, { raw: { width, height, channels: 4 } }).webp({ quality: 94, alphaQuality: 100 }).toFile(destination);
}

await Promise.all(items.map(([source, output]) => removeConnectedWhiteBackground(source, `public/${output}`)));
