import * as fs from 'fs';
import * as path from 'path';

const techStackDir = 'public/techstack';
const techStackImages: { name: string; path: string }[] = [];

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function walkDir(dir: string, callback: (filePath: string) => void): void {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

console.log(JSON.stringify(techStackImages, null, 2));

export const getTechStackImages = async (): Promise<{ name: string; path: string }[]> => {
  walkDir(techStackDir, (filePath: string) => {
    const fileName = path.basename(filePath, path.extname(filePath));
    techStackImages.push({
      name: capitalizeFirstLetter(fileName),
      path: filePath.replace(/\\/g, '/'), // Convert backslashes to forward slashes for consistency
    });
  });

  return Promise.resolve(techStackImages);
};
