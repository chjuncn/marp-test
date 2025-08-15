import { z } from 'zod'

export const MovableItemSchema = z.object({
  id: z.string(),
  x: z.number().nonnegative(),
  y: z.number().nonnegative(),
  w: z.number().positive().optional(),
  h: z.number().positive().optional(),
  content: z.string().optional(),
})

export const MovableSchema = z.object({
  width: z.number().int().positive().max(2000).default(600),
  height: z.number().int().positive().max(2000).default(300),
  items: z.array(MovableItemSchema).default([]),
})

export const ImageEditorSchema = z.object({
  src: z.string().min(1),
  width: z.number().int().positive().max(2000).default(640),
})

export const TableVanillaSchema = z.object({
  caption: z.string().optional(),
  columns: z.array(z.string()),
  rows: z.array(z.array(z.union([z.string(), z.number()]))),
  align: z.array(z.enum(['left', 'center', 'right'])).optional(),
})

export type MovableConfig = z.infer<typeof MovableSchema>
export type ImageEditorConfig = z.infer<typeof ImageEditorSchema>
export type TableVanillaConfig = z.infer<typeof TableVanillaSchema>


