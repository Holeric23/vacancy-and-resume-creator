export class CodecError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'CodecError';
  }
}

export class ValidationError extends CodecError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class ParseError extends CodecError {
  constructor(message: string) {
    super(message, 'PARSE_ERROR');
    this.name = 'ParseError';
  }
}