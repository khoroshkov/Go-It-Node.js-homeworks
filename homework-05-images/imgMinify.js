const path = require("path");
const { promises: fsPromises } = require("fs");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

async function minifyImage(req, res, next) {
  try {
    await imagemin(["temp"], {
      destination: "public/images",
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });

    const { filename, path: tempPath } = req.file;

    await fsPromises.unlink(tempPath);

    req.file = {
      ...req.file,
      path: path.join("public/images", filename),
      destination: "public/images",
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { minifyImage };
