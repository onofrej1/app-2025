import https from "https";
import fs from "fs";
import path from "path";

function download(
  url: string,
  folder?: string,
  filename?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = https
      .request(url, { headers: { "User-Agent": "javascript" } }, (response) => {
        if (response.statusCode === 302 && response.headers.location != null) {
          download(
            buildNextUrl(url, response.headers.location),
            folder,
            filename
          )
            .then(resolve)
            .catch(reject);
          return;
        }

        const file = fs.createWriteStream(
          buildDestinationPath(url, folder, filename)
        );
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", reject);
    req.end();
  });
}

function buildNextUrl(current: string, next: string) {
  const isNextUrlAbsolute = RegExp("^(?:[a-z]+:)?//").test(next);
  if (isNextUrlAbsolute) {
    return next;
  } else {
    const currentURL = new URL(current);
    const fullHost = `${currentURL.protocol}//${currentURL.hostname}${
      currentURL.port ? ":" + currentURL.port : ""
    }`;
    return `${fullHost}${next}`;
  }
}

function buildDestinationPath(url: string, folder?: string, filename?: string) {
  return path.join(folder ?? "./", filename ?? generateFilenameFromPath(url));
}

function generateFilenameFromPath(url: string): string {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1] ?? "";
}

export default download;
