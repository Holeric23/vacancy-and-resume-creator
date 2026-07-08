import { z } from 'zod';
import { RawProjectEnvelope, projectEnvelopeSchema } from '../schema/document-schema.ts';
import { ParseError, ValidationError } from './project-file-errors.ts';
import { MigrationRegistry } from '../migrations/migration-registry.ts';

// Парсит строку файла, вычисляет версию, проводит миграции и возвращает валидный конверт
export function parseProject(jsonString: string): RawProjectEnvelope {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(jsonString);
  } catch (err) {
    throw new ParseError(`Не удалось прочитать файл проекта: некорректный JSON. ${(err as Error).message}`);
  }

  let version = 1; // Если поля schemaVersion нет — это старый проект версии 1

  if (
    parsedJson &&
    typeof parsedJson === 'object' &&
    'schemaVersion' in parsedJson &&
    typeof parsedJson.schemaVersion === 'number'
  ) {
    version = parsedJson.schemaVersion;
  }

  const registry = new MigrationRegistry();
  
  // Проводим данные через цепочку миграций, если файл устарел
  const migratedData = registry.migrateToCurrent(parsedJson, version);

  // Валидируем каноническую схему актуальной версии через Zod
  const validationResult = projectEnvelopeSchema.safeParse(migratedData);
  if (!validationResult.success) {
    throw new ValidationError(
      `Ошибка проверки структуры импортируемого документа: ${validationResult.error.errors
        .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')}`
    );
  }

  return validationResult.data;
}