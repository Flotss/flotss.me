// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Group } from "next/dist/shared/lib/router/utils/route-regex";
import { FileMap, TechStackItem } from "../types/types";

type Data = {
  TechStack: TechStackItem[] | null;
};

let order = [
  "Languages",
  "Frameworks",
  "Databases",
  "Hosting",
  "Tools",
  "Other",
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Research of files in public folder in typescript
  const files = require.context(
    "../../../public/techstack/",
    true,
    /^\.\/.*\/.*\.png$/
  );

  // Create an array of tech stack items
  const techStack: TechStackItem[] = [];

  // Loop on all files
  files.keys().forEach((file) => {
    // Get the file source
    let fileSrc = file;

    // Get the category
    let category = fileSrc.split("/")[1];

    // Add the tech stack folder to the file source
    fileSrc = fileSrc.replace(".", "/techstack");

    // Check if the category already exists in the tech stack
    let techStackItem = techStack.find((item) => item.category === category);
    if (!techStackItem) {
      techStackItem = { category, files: [] };
      techStack.push(techStackItem);
    }

    // Research the file name
    let fileName = file.split("/")[2].replace(".png", "");

    // Add the file to the tech stack item
    techStackItem.files.push({ name : fileName, src: fileSrc });
  });

  // Sort the tech stack
  techStack.sort((a, b) => {
    return order.indexOf(a.category) - order.indexOf(b.category);
  });

  // Return all files in public folder
  res.status(200).json({ TechStack: techStack.length ? techStack : null });
}
