import { PathName } from "./exercises";

export const colors = {
  bg: "#0A1628",
  card: "#1A1A2E",
  cardLight: "#222244",
  primary: "#E94560",
  secondary: "#533483",
  accent: "#0F3460",
  text: "#FFFFFF",
  textDim: "#8888AA",
  locked: "#333355",
  breaking: "#FFD700",
  success: "#00C851",
};

export const pathColors: Record<PathName, string> = {
  push: "#85B7EB",
  pull: "#AFA9EC",
  core: "#5DCAA5",
  legs: "#F0997B",
  skills: "#ED93B1",
  rings: "#FAC775",
  breakdance: "#F09595",
  flexibility: "#97C459",
};

export const pathDarkColors: Record<PathName, string> = {
  push: "#185FA5",
  pull: "#534AB7",
  core: "#0F6E56",
  legs: "#993C1D",
  skills: "#993556",
  rings: "#854F0B",
  breakdance: "#A32D2D",
  flexibility: "#3B6D11",
};

export const pathStrokeColors: Record<PathName, string> = {
  push: "#042C53",
  pull: "#26215C",
  core: "#04342C",
  legs: "#4A1B0C",
  skills: "#4B1528",
  rings: "#412402",
  breakdance: "#501313",
  flexibility: "#173404",
};

export const pathIcons: Record<PathName, string> = {
  push: "💪",
  pull: "🏋️",
  core: "🔥",
  legs: "🦵",
  skills: "⭐",
  rings: "🔗",
  breakdance: "🤸",
  flexibility: "🧘",
};
