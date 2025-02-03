const sizeOf = require("image-size");

export function getImageOrientation(imagePath: string) {
  const dir = process.cwd() + "/public";
  try {
    const dimensions = sizeOf(dir + imagePath);
    const { width, height } = dimensions;
    if (width > height) {
      return "HORIZONTAL";
    } else if (height > width) {
      return "VERTICAL";
    } else {
      return "SQUARE";
    }
  } catch (err) {
    console.error("Error reading image dimensions:", err);
    return "SQUARE";
  }
}

export function slugify(title: string) {
  return title
    .trim()
    .replace(/ +/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}
