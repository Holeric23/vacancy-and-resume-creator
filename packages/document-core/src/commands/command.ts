import { Document } from '../model/document.ts';

export interface CommandResult {
  document: Document;
  inverse: Command; // Команда, которая совершит обратное действие
}

export interface Command {
  readonly type: string;
  execute(document: Document): CommandResult;
}