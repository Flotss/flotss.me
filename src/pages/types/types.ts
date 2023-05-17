interface FileMap {
  [fileName: string]: string;
}

export default interface TechStackItem {
  category: string;
  files: FileMap[];
}
