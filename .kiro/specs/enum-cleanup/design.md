# Design Document: Enum Cleanup

## Overview

This design outlines the systematic approach to clean up enum usage in the NestJS application by removing unused enums and converting used enums to string literal types. The solution maintains type safety while reducing runtime overhead and improving code maintainability.

## Architecture

### Current State Analysis
- **Enum Location**: All enums are located in `src/model/enums/` directory
- **Usage Pattern**: Enums are primarily used in TypeORM entity column definitions
- **TypeORM Integration**: Enums are used with `@Column({ type: 'enum', enum: EnumName })` decorators
- **Value Pattern**: Most enums use string values (e.g., `ACTIVE = 'active'`)

### Target State
- **String Literal Types**: Replace enums with union string literal types
- **Constants Object**: Create const objects for runtime value access when needed
- **Type Safety**: Maintain compile-time type checking
- **Database Compatibility**: Preserve existing database column constraints

## Components and Interfaces

### 1. Enum Analysis Component
**Purpose**: Identify used vs unused enums

**Implementation**:
```typescript
interface EnumUsageAnalysis {
  enumFile: string;
  enumName: string;
  isUsed: boolean;
  usageLocations: string[];
  values: Record<string, string>;
}
```

**Process**:
1. Scan all enum files in `src/model/enums/`
2. Search for imports and references across the codebase
3. Categorize as used/unused
4. Extract enum values for conversion

### 2. String Literal Type Generator
**Purpose**: Convert enum definitions to string literal types

**Pattern**:
```typescript
// Before (enum)
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  ARCHIVED = 'archived',
}

// After (string literal type + constants)
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'archived';

export const USER_STATUS = {
  ACTIVE: 'active' as const,
  INACTIVE: 'inactive' as const,
  SUSPENDED: 'suspended' as const,
  ARCHIVED: 'archived' as const,
} as const;
```

### 3. Entity Update Component
**Purpose**: Update TypeORM entity definitions

**Transformation Pattern**:
```typescript
// Before
@Column({
  type: 'enum',
  enum: UserStatus,
  default: UserStatus.ACTIVE,
})
status: UserStatus;

// After
@Column({
  type: 'enum',
  enum: ['active', 'inactive', 'suspended', 'archived'],
  default: 'active',
})
status: UserStatus;
```

## Data Models

### Enum Conversion Mapping
```typescript
interface EnumConversion {
  originalEnumName: string;
  newTypeName: string;
  constantsObjectName: string;
  values: Array<{
    key: string;
    value: string;
  }>;
  usageLocations: Array<{
    file: string;
    line: number;
    context: 'import' | 'column' | 'property' | 'default';
  }>;
}
```

### File Operation Plan
```typescript
interface FileOperation {
  type: 'delete' | 'create' | 'update';
  filePath: string;
  content?: string;
  changes?: Array<{
    oldText: string;
    newText: string;
  }>;
}
```

## Error Handling

### Validation Checks
1. **Compilation Verification**: Ensure TypeScript compiles after each change
2. **Import Resolution**: Verify all imports are correctly updated
3. **Database Compatibility**: Confirm enum values remain consistent
4. **Test Compatibility**: Ensure existing tests continue to pass

### Rollback Strategy
- Maintain backup of original enum files during conversion
- Implement atomic file operations where possible
- Provide detailed logging of all changes made

### Error Recovery
- If compilation fails, revert changes and report specific issues
- Handle circular dependencies in enum usage
- Manage cases where enums are used in multiple contexts

## Testing Strategy

### Pre-Conversion Testing
1. **Baseline Compilation**: Verify current code compiles successfully
2. **Enum Usage Mapping**: Create comprehensive map of all enum references
3. **Test Suite Execution**: Run existing tests to establish baseline

### Post-Conversion Validation
1. **Compilation Test**: Verify TypeScript compilation succeeds
2. **Type Safety Test**: Confirm type checking still works correctly
3. **Runtime Behavior Test**: Ensure database operations work as expected
4. **Import Resolution Test**: Verify no broken imports remain

### Test Cases
```typescript
// Type safety validation
const validStatus: UserStatus = 'active'; // Should compile
const invalidStatus: UserStatus = 'invalid'; // Should fail compilation

// Runtime value access
const statusValue = USER_STATUS.ACTIVE; // Should equal 'active'

// Database column constraint
// Should accept valid enum values, reject invalid ones
```

## Implementation Phases

### Phase 1: Analysis and Planning
- Scan and categorize all enums
- Identify usage patterns and dependencies
- Generate conversion plan

### Phase 2: Unused Enum Removal
- Remove enum files that have no references
- Clean up any orphaned imports

### Phase 3: Used Enum Conversion
- Convert enums to string literal types
- Update entity column definitions
- Update import statements

### Phase 4: Validation and Testing
- Compile and test the updated codebase
- Verify database compatibility
- Run comprehensive test suite

## Database Considerations

### Column Type Compatibility
- PostgreSQL: `enum` columns will continue to work with string values
- MySQL: `enum` columns maintain same constraint behavior
- SQLite: String columns remain unchanged

### Migration Requirements
- **No migrations needed**: String values remain identical
- **Constraint preservation**: Database enum constraints stay intact
- **Default value compatibility**: Default values use same string literals

## Performance Impact

### Positive Impacts
- **Reduced bundle size**: No enum runtime code generation
- **Faster compilation**: Simpler type checking for string literals
- **Better tree shaking**: Unused constants can be eliminated

### Neutral Impacts
- **Runtime performance**: String comparisons remain the same
- **Memory usage**: Minimal difference in memory footprint
- **Database performance**: No change in query performance