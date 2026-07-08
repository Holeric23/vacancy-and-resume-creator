import { RawProjectEnvelope, projectEnvelopeSchema } from '../schema/document-schema.ts';
import { ValidationError } from './project-file-errors.ts';
import { CURRENT_SCHEMA_VERSION } from '../schema/schema-version.ts';

// Принимает чистый канонический документ и превращает в валидный JSON-конверт
export function serializeProject(
  document: unknown,
  projectId: string,
  createdAt?: string
): string {
  const envelope: RawProjectEnvelope = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    projectId,
    createdAt: createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    document: document as RawProjectEnvelope['document'],
  };

  // Валидируем перед записью, чтобы исключить сохранение поврежденных данных
  const result = projectEnvelopeSchema.safeParse(envelope);
  if (!result.success) {
    throw new ValidationError(
      `Не удалось сохранить проект: ошибка валидации схемы. ${result.error.message}`
    );
  }

  return JSON.stringify(result.data, null, 2);
}