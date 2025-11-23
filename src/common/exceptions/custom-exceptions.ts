import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base custom exception class
 */
export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public readonly details?: any,
  ) {
    super(message, statusCode);
  }
}

/**
 * Resource not found exception
 */
export class NotFoundException extends BaseException {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, HttpStatus.NOT_FOUND, { resource, identifier });
  }
}

/**
 * Bad request exception with details
 */
export class BadRequestException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, details);
  }
}

/**
 * Validation exception
 */
export class ValidationException extends BaseException {
  constructor(message: string, public readonly errors: any[]) {
    super(message, HttpStatus.BAD_REQUEST, { errors });
  }
}

/**
 * Conflict exception (e.g., duplicate resource)
 */
export class ConflictException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.CONFLICT, details);
  }
}

/**
 * Unauthorized exception
 */
export class UnauthorizedException extends BaseException {
  constructor(message: string = 'Unauthorized access') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

/**
 * Forbidden exception
 */
export class ForbiddenException extends BaseException {
  constructor(message: string = 'Access forbidden') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

/**
 * Internal server error exception
 */
export class InternalServerErrorException extends BaseException {
  constructor(message: string = 'Internal server error', details?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}

/**
 * Database operation exception
 */
export class DatabaseException extends BaseException {
  constructor(message: string, originalError?: any) {
    super(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      process.env.NODE_ENV === 'development' ? { originalError } : undefined,
    );
  }
}

