import { atom } from "jotai";

export type ToolType = "select" | "rectangle" | "ellipse" | "pencil" | "move" | "delete";

export const toolAtom = atom<ToolType>("rectangle");