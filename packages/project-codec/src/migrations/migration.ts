export interface Migration {
  readonly fromVersion: number;
  readonly toVersion: number;
  migrate(rawData: unknown): unknown;
}