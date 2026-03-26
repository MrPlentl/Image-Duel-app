export type AppStage = 'folder-select' | 'pass1' | 'pass2' | 'pass3' | 'success';

export interface AppState {
  stage: AppStage;
  folderPath: string;
  allImages: string[];
  pass1Keep: string[];   // Images surviving Pass 1
  pass2Keep: string[];   // Images surviving Pass 2
  finalKeep: string[];   // User's final 4 selections
}

export const initialAppState: AppState = {
  stage: 'folder-select',
  folderPath: '',
  allImages: [],
  pass1Keep: [],
  pass2Keep: [],
  finalKeep: [],
};

export function imageUrl(filename: string): string {
  return `/api/image?file=${encodeURIComponent(filename)}`;
}
