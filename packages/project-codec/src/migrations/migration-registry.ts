import { Migration } from './migration.ts';
import { V1ToV2Migration } from './v1-to-v2.ts';
import { CURRENT_SCHEMA_VERSION } from '../schema/schema-version.ts';

export class MigrationRegistry {
  private readonly migrations: Migration[] = [];

  constructor() {
    // Регистрируем нашу первую миграцию
    this.migrations.push(new V1ToV2Migration());
  }

  migrateToCurrent(rawData: unknown, detectedVersion: number): unknown {
    let currentData = rawData;
    let currentVersion = detectedVersion;

    // Циклически прогоняем миграции по цепочке версий
    while (currentVersion < CURRENT_SCHEMA_VERSION) {
      const migration = this.migrations.find(
        (m) => m.fromVersion === currentVersion
      );

      if (!migration) {
        throw new Error(
          `Не удалось найти схему миграции для перехода с версии ${currentVersion}`
        );
      }

      currentData = migration.migrate(currentData);
      currentVersion = migration.toVersion;
    }

    return currentData;
  }
}