import { z } from 'zod';

// Схемы базовой геометрии
export const rectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

// Схемы стилей
export const shadowStyleSchema = z.object({
  offsetX: z.number(),
  offsetY: z.number(),
  blur: z.number(),
  color: z.string(),
});

export const nodeStyleSchema = z.object({
  backgroundColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderWidth: z.number().optional(),
  cornerRadius: z.number().optional(),
  shadow: shadowStyleSchema.optional(),
});

export const textStyleSchema = z.object({
  textColor: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  lineHeight: z.number().optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
});

// Схемы узлов (Discriminated Union по полю 'kind')
export const baseNodeSchema = z.object({
  id: z.string(),
  frame: rectSchema,
  zIndex: z.number(),
  style: nodeStyleSchema,
});

export const shapeNodeSchema = baseNodeSchema.extend({
  kind: z.literal('shape'),
  shapeType: z.enum(['rectangle', 'ellipse']),
});

export const textNodeSchema = baseNodeSchema.extend({
  kind: z.literal('text'),
  content: z.string(),
  textStyle: textStyleSchema,
});

export const headingNodeSchema = baseNodeSchema.extend({
  kind: z.literal('heading'),
  content: z.string(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  textStyle: textStyleSchema,
});

export const listNodeSchema = baseNodeSchema.extend({
  kind: z.literal('list'),
  items: z.array(z.string()),
  ordered: z.boolean(),
  textStyle: textStyleSchema,
});

export const documentNodeSchema = z.discriminatedUnion('kind', [
  shapeNodeSchema,
  textNodeSchema,
  headingNodeSchema,
  listNodeSchema,
]);

// Схема страницы (Обновлен список валидируемых пресетов)
export const pageSchema = z.object({
  id: z.string(),
  preset: z.enum(['A3', 'A4', 'A5', 'letter']),
  orientation: z.enum(['portrait', 'landscape']),
  nodesById: z.record(z.string(), documentNodeSchema),
  nodeOrder: z.array(z.string()),
});

// Схема канонического документа
export const documentSchema = z.object({
  id: z.string(),
  title: z.string(),
  pagesById: z.record(z.string(), pageSchema),
  pageOrder: z.array(z.string()),
});

// Схема конверта проекта для сохранения в файлы
export const projectEnvelopeSchema = z.object({
  schemaVersion: z.number(),
  projectId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  document: documentSchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type RawProjectEnvelope = z.infer<typeof projectEnvelopeSchema>;