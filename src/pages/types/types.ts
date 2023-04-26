export interface FileMap {
  [fileName: string]: string;
}

export interface TechStackItem {
  category: string;
  files: FileMap[];
}
