# Entity and Relationship Improvements

## Critical Issues

### 1. **Approval-ChangeRequest Relationship Conflict**
**Problem**: Both entities have OneToOne relationships pointing to each other, creating a circular dependency.

**Current State**:
- `Approval` has `changeRequestId` and OneToOne relationship to `ChangeRequest`
- `ChangeRequest` has `approvalId` and OneToOne relationship to `Approval`

**Recommendation**: 
- Remove `approval_id` from `ChangeRequest` 
- Keep the relationship only in `Approval` (Approval owns the foreign key)
- `ChangeRequest` can access approval via inverse relationship

### 2. **Approval.approvedAt Should Be Nullable**
**Problem**: `approvedAt` uses `@CreateDateColumn` which auto-generates on creation, but approvals are created before approval.

**Recommendation**: Change to `@Column` with `nullable: true` and manually set when approved.

### 3. **File Entity Reverse Relationships**
**Problem**: `File` has `@OneToMany` to `Organizer`, but `Organizer` has `@ManyToOne` to `File`. The reverse relationship declaration is incorrect.

**Current State**:
```typescript
// File entity
@OneToMany(() => Organizer, (organizer) => organizer.profileImage)
organizersUsingAsProfile: Organizer[];

// Organizer entity  
@ManyToOne(() => File, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'profile_image_id' })
profileImage: File;
```

**Recommendation**: Remove the reverse relationship from `File` entity. TypeORM will handle it automatically through the `@ManyToOne` in `Organizer`.

## Consistency Issues

### 4. **BaseEntity Inconsistency**
**Problem**: Only `Organizer` extends `BaseEntity`, but many entities should have audit fields.

**Recommendation**: 
- Extend `BaseEntity` for: `User`, `Booking`, `Approval`, `Payment`, `Refund`, `Promotion`, `Event`, `SubEvent`, `Ticket`, `ChangeRequest`
- Or create separate audit fields where `BaseEntity` doesn't fit (e.g., `User` might need different tracking)

### 5. **BaseEntity createdBy/updatedBy Type**
**Problem**: `createdBy` and `updatedBy` are strings instead of foreign keys to `User`.

**Recommendation**: 
- If you want to track User IDs, change to `bigint` and add `@ManyToOne` relationships
- If you want to track usernames/identifiers, keep as strings but document it clearly
- Consider using `nullable: true` for system-generated records

### 6. **Missing Audit Fields**
**Problem**: Entities like `User`, `Booking`, `Payment`, `Refund` have `createdAt` but not `updatedAt` or audit fields.

**Recommendation**: Standardize audit fields across all entities.

## Data Integrity Issues

### 7. **Nullable Foreign Keys**
**Problem**: Critical foreign keys are nullable when they shouldn't be.

**Recommendations**:
- `Booking.userId` - Should NOT be nullable (required)
- `Booking.eventId` - Should NOT be nullable (required)
- `Ticket.bookingId` - Should NOT be nullable (required)
- `Ticket.userId` - Should NOT be nullable (required)
- `Ticket.ticketCategoryId` - Should NOT be nullable (required)
- `Payment.bookingId` - Should NOT be nullable (required)
- `Refund.paymentId` - Should NOT be nullable (required)
- `Event.organizerId` - Should NOT be nullable (required)
- `SubEvent.eventId` - Should NOT be nullable (required)
- `Promotion.eventId` - Should NOT be nullable (required)

### 8. **Missing Cascade Options**
**Problem**: No cascade delete options defined, which could lead to orphaned records.

**Recommendations**:
- `Booking` → `Ticket`: Add `cascade: true` or `onDelete: 'CASCADE'`
- `Event` → `SubEvent`: Add `onDelete: 'CASCADE'`
- `Event` → `TicketCategory`: Add `onDelete: 'CASCADE'`
- `Event` → `Booking`: Add `onDelete: 'CASCADE'` or `'SET NULL'` depending on business logic
- `TicketCategory` → `Ticket`: Add `onDelete: 'CASCADE'` or `'RESTRICT'` depending on business logic
- `Organizer` → `Event`: Add `onDelete: 'RESTRICT'` or `'SET NULL'` depending on business logic
- `Payment` → `Refund`: Add `onDelete: 'RESTRICT'` (prevent deletion if refunds exist)

## Performance Improvements

### 9. **Missing Indexes**
**Problem**: Frequently queried fields lack indexes.

**Recommendations**:
- `Booking`: Add indexes on `userId`, `eventId`, `status`, `payment_status`, `booking_time`
- `Ticket`: Add indexes on `bookingId`, `userId`, `ticketCategoryId`, `status`, `ticket_number`
- `Payment`: Add indexes on `bookingId`, `status`, `payment_time`
- `Event`: Add indexes on `organizerId`, `status`, `is_published`, `start_date_time`, `end_date_time`
- `Promotion`: Add indexes on `eventId`, `code`, `is_active`, `valid_from`, `valid_to`
- `Approval`: Add indexes on `change_request_id`, `approver_id`, `approval_status`
- `ChangeRequest`: Add indexes on `entity_type`, `submitted_by`, `approval_status`

### 10. **Missing Composite Indexes**
**Problem**: Queries filtering by multiple columns would benefit from composite indexes.

**Recommendations**:
- `Booking`: `(eventId, status)`, `(userId, status)`
- `Ticket`: `(bookingId, status)`, `(userId, status)`
- `Event`: `(organizerId, status)`, `(is_published, status)`

## Relationship Improvements

### 11. **Missing Inverse Relationships**
**Problem**: Some relationships are defined but inverse side might be missing.

**Recommendations**:
- Verify all `@OneToMany` have corresponding `@ManyToOne`
- Verify all `@ManyToOne` have corresponding `@OneToMany` where needed

### 12. **Relationship Naming**
**Problem**: Some relationships have unclear names or typos.

**Recommendations**:
- Fix typo in `Approval` entity: `//ont to one` → proper comment
- Consider renaming `File.organizersUsingAsProfile` (if kept) to something clearer

## Type Safety Improvements

### 13. **Enum Types**
**Problem**: Some enum fields use string types instead of enums.

**Recommendations**:
- `Promotion.discountType` - Create enum if limited set of values
- `Promotion.promotionType` - Create enum if limited set of values
- `File.fileType` - Create enum if limited set of values
- `OrganizerDocument.docType` - Create enum if limited set of values

### 14. **Decimal Precision**
**Problem**: All decimal fields use `precision: 10, scale: 2`. Consider if this is appropriate for all cases.

**Recommendations**:
- Review if `scale: 2` is appropriate for all monetary values
- Consider `precision: 19, scale: 4` for high-precision financial calculations

## Additional Recommendations

### 15. **Soft Deletes**
**Consideration**: Add soft delete support (`deletedAt` column) for critical entities:
- `User`
- `Organizer`
- `Event`
- `Booking`

### 16. **Optimistic Locking**
**Consideration**: Add version fields for entities that might have concurrent updates:
- `Event` (already has `version`)
- `SubEvent` (already has `version`)
- `Booking` (consider adding if concurrent updates possible)
- `Payment` (consider adding if concurrent updates possible)

### 17. **Timestamp Types**
**Problem**: Mix of `timestamp` and `timestamptz` types.

**Recommendation**: Standardize on `timestamptz` for all timestamp fields to handle timezones properly.

### 18. **Foreign Key Constraints**
**Problem**: No explicit foreign key constraints defined in TypeORM decorators.

**Recommendation**: Ensure database migrations create proper foreign key constraints with appropriate actions:
- `ON DELETE CASCADE` for child records
- `ON DELETE RESTRICT` for critical relationships
- `ON DELETE SET NULL` for optional relationships

## Summary of Priority Fixes

**High Priority**:
1. Fix Approval-ChangeRequest relationship conflict
2. Make Approval.approvedAt nullable
3. Fix File entity reverse relationships
4. Make critical foreign keys NOT NULL

**Medium Priority**:
5. Standardize BaseEntity usage
6. Add cascade options
7. Add missing indexes

**Low Priority**:
8. Create enums for string fields
9. Add soft deletes
10. Standardize timestamp types

