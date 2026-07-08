export * from './schema/schema-version.ts';
export * from './schema/document-schema.ts';
export * from './migrations/migration.ts';
export * from './migrations/v1-to-v2.ts';
export * from './migrations/migration-registry.ts';
export * from './serialization/project-file-errors.ts';
export * from './serialization/serialize-project.ts';
export * from './serialization/parse-project.ts';

export const CODEC_VERSION = "2.0.0";