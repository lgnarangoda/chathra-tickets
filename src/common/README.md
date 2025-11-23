# Common Error Handling System

This directory contains a standardized error handling system that provides consistent error and success responses to the frontend.

## Features

- **Consistent Error Format**: All errors follow the same structure
- **Consistent Success Format**: All successful responses follow the same structure
- **Custom Exceptions**: Pre-built exception classes for common scenarios
- **Automatic Error Transformation**: Global filter automatically formats all errors
- **Validation Error Support**: Handles class-validator validation errors
- **Database Error Handling**: Catches and formats database-specific errors

## Response Formats

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Event with identifier '123' not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/v1/events/123",
  "details": { ... }
}
```

### Validation Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/v1/events",
  "errors": [
    {
      "field": "name",
      "message": "name should not be empty"
    }
  ]
}
```

## Usage

### Using Custom Exceptions

```typescript
import { NotFoundException, BadRequestException } from '../common/exceptions/custom-exceptions';

// Throw a not found exception
throw new NotFoundException('Event', eventId);

// Throw a bad request with details
throw new BadRequestException('Invalid input', { field: 'email' });

// Throw a validation exception
throw new ValidationException('Validation failed', [
  { field: 'name', message: 'Name is required' }
]);
```

### Available Custom Exceptions

- `NotFoundException(resource, identifier?)` - 404 Not Found
- `BadRequestException(message, details?)` - 400 Bad Request
- `ValidationException(message, errors[])` - 400 Bad Request with validation errors
- `ConflictException(message, details?)` - 409 Conflict
- `UnauthorizedException(message?)` - 401 Unauthorized
- `ForbiddenException(message?)` - 403 Forbidden
- `InternalServerErrorException(message?, details?)` - 500 Internal Server Error
- `DatabaseException(message, originalError?)` - 500 Database Error

### Database Error Handling

The system automatically handles common database errors:

- **Unique Constraint Violations** (23505): Returns 400 Bad Request
- **Foreign Key Violations** (23503): Returns 400 Bad Request
- **Other Database Errors**: Returns 500 Internal Server Error

### Example Service Implementation

```typescript
import { Injectable } from '@nestjs/common';
import { NotFoundException, DatabaseException } from '../common/exceptions/custom-exceptions';

@Injectable()
export class EventService {
  async findById(id: number) {
    const event = await this.repository.findOne({ where: { id } });
    
    if (!event) {
      throw new NotFoundException('Event', id);
    }
    
    return event;
  }

  async create(data: CreateDto) {
    try {
      return await this.repository.save(data);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Duplicate entry');
      }
      throw new DatabaseException('Failed to create event', error);
    }
  }
}
```

## Files

- `dto/error-response.dto.ts` - TypeScript interfaces for error and success responses
- `exceptions/custom-exceptions.ts` - Custom exception classes
- `filters/http-exception.filter.ts` - Global exception filter
- `interceptors/transform.interceptor.ts` - Global response transformer for success responses

