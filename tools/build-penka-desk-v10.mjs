import fs from "node:fs";
import { PNG } from "pngjs";

const sourcePath = "assets/chapter1/scenes/municipality/penka-desk-v5.png";
const outputPath = "assets/chapter1/scenes/municipality/penka-desk-v10.png";

const source = PNG.sync.read(fs.readFileSync(sourcePath));
const output = new PNG({ width: source.width, height: source.height });

// The computer-side end is shifted down as one rigid section. The displacement
// then eases out across the receding tabletop and reaches zero at its near edge,
// leaving the apron, front panel, legs, feet, and layer registration unchanged.
const farShift = 180;
const taperStart = 250;
const fixedNearEdge = 735;

function destinationY(sourceY) {
  if (sourceY <= taperStart) return sourceY + farShift;
  if (sourceY >= fixedNearEdge) return sourceY;

  const progress = (sourceY - taperStart) / (fixedNearEdge - taperStart);
  return sourceY + farShift * (1 - progress);
}

function compositePixel(x, y, red, green, blue, alpha, weight) {
  if (y < 0 || y >= output.height || alpha <= 0 || weight <= 0) return;

  const targetIndex = (y * output.width + x) * 4;
  const incomingAlpha = (alpha / 255) * weight;
  const existingAlpha = output.data[targetIndex + 3] / 255;
  const combinedAlpha = incomingAlpha + existingAlpha * (1 - incomingAlpha);

  if (combinedAlpha <= 0) return;

  for (let channel = 0; channel < 3; channel += 1) {
    const incomingChannel = channel === 0 ? red : channel === 1 ? green : blue;
    output.data[targetIndex + channel] = Math.round(
      (incomingChannel * incomingAlpha +
        output.data[targetIndex + channel] * existingAlpha * (1 - incomingAlpha)) /
        combinedAlpha
    );
  }
  output.data[targetIndex + 3] = Math.round(combinedAlpha * 255);
}

for (let sourceY = 0; sourceY < source.height; sourceY += 1) {
  const mappedY = destinationY(sourceY);
  const upperY = Math.floor(mappedY);
  const lowerWeight = mappedY - upperY;
  const upperWeight = 1 - lowerWeight;

  for (let x = 0; x < source.width; x += 1) {
    const sourceIndex = (sourceY * source.width + x) * 4;
    const red = source.data[sourceIndex];
    const green = source.data[sourceIndex + 1];
    const blue = source.data[sourceIndex + 2];
    const alpha = source.data[sourceIndex + 3];

    compositePixel(x, upperY, red, green, blue, alpha, upperWeight);
    compositePixel(x, upperY + 1, red, green, blue, alpha, lowerWeight);
  }
}

fs.writeFileSync(outputPath, PNG.sync.write(output));
console.log(`Wrote ${outputPath} (${output.width}x${output.height})`);
