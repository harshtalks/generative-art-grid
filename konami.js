const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = async () => {
  const count = 20;
  const characters = "←↑→↓AB".split("");
  const background = "hsl(0, 0%, 96%)";
  const palette = ["hsl(0, 0%, 10%)"];

  const createGrid = () => {
    const points = [];

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);
        const position = [u, v];
        const character = random.pick(characters);
        const r = /[AB]/i.test(character) ? 25 : 50;
        const e = /[AB]/i.test(character) ? 10 : 20;

        points.push({
          color: random.pick(palette),
          radius: Math.abs(r + e * random.gaussian()),
          position,
          character,
        });
      }
    }

    return points;
  };

  let points = createGrid().filter(() => random.chance(0.5));

  const fonturl = "./font/SpaceGrotesk-Medium.woff";
  const font = new window.FontFace("SpaceGrotesk-Medium", `url(${fonturl})`);

  await font.load();

  document.fonts.add(font);

  return ({ context, width, height }) => {
    const margin = width * 0.175;

    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    points.forEach((point) => {
      const { position, radius, color, character } = point;

      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.fillStyle = color;
      context.font = `${radius}px "SpaceGrotesk-Medium"`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(character, x, y);
    });
  };
};

canvasSketch(sketch, settings);
