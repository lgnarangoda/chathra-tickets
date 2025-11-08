erDiagram
    %% User Management
    User ||--o{ UserRole : has
    Role ||--o{ UserRole : assigned_to
    
    %% Organizer Management
    Organizer ||--o{ OrganizerDocument : has
    Organizer ||--o{ Event : creates
    File ||--o{ Organizer : "profile_image"
    User ||--o{ OrganizerDocument : submits
    
    %% Event Management
    Event ||--o{ SubEvent : contains
    Event ||--o{ EventVenue : uses
    Event ||--o{ TicketCategory : has
    Event ||--o{ Booking : receives
    Event ||--o{ Promotion : offers
    Event ||--o{ File : has_files
    
    %% Venue Management
    Venue ||--o{ EventVenue : "used_in"
    
    %% SubEvent Management
    SubEvent ||--o{ SubEventResourcePerson : features
    SubEvent ||--o{ TicketSubEvent : linked_to
    
    %% Resource Person Management
    ResourcePerson ||--o{ SubEventResourcePerson : participates
    ResourcePerson ||--o{ File : has_images
    
    %% Ticket Management
    TicketCategory ||--o{ Ticket : generates
    TicketCategory ||--o{ TicketSubEvent : linked_to
    Ticket ||--o| Booking : belongs_to
    User ||--o{ Ticket : owns
    
    %% Booking & Payment Management
    User ||--o{ Booking : makes
    Booking ||--o{ Payment : has
    Booking ||--o{ Ticket : contains
    Payment ||--o{ Refund : may_have
    User ||--o{ Refund : refunded_by
    
    %% Promotion Management
    User ||--o{ Promotion : creates
    
    %% Approval & Change Request Management
    User ||--o{ ChangeRequest : submits
    ChangeRequest ||--|| Approval : has
    User ||--o{ Approval : approves
    
    %% File Management
    File ||--o{ OrganizerDocument : "used_in"
    File ||--o{ SubEventResourcePerson : "profile_image"
    
    %% Entity Definitions
    User {
        bigint user_id PK
        varchar name
        varchar email UK
        varchar phone
        varchar password_hash
        enum status
        boolean is_guest
        timestamp created_at
        timestamp updated_at
    }
    
    Role {
        bigint role_id PK
        varchar name UK
    }
    
    UserRole {
        bigint id PK
        bigint user_id FK
        bigint role_id FK
    }
    
    Organizer {
        bigint organizer_id PK
        varchar name
        varchar email
        varchar phone
        varchar organization_type
        varchar business_type
        text description
        varchar nic_or_br_number
        bigint profile_image_id FK
        enum status
    }
    
    OrganizerDocument {
        bigint id PK
        bigint organizer_id FK
        bigint file_id FK
        varchar doc_type
        bigint submitted_by FK
        timestamp uploaded_at
    }
    
    Event {
        bigint event_id PK
        bigint organizer_id FK
        varchar name
        varchar event_slug UK
        text description
        varchar location
        text address
        varchar country
        varchar city
        bigint thumbnail_image_id
        bigint cover_image_id
        simple-array image_gallery_ids
        timestamp start_date_time
        timestamp end_date_time
        varchar language
        enum event_mode
        enum event_category
        int age_limit
        varchar timezone
        text organizer_notes
        text booking_terms
        text cancellation_policy
        boolean is_featured
        boolean is_published
        boolean is_cancelled
        int max_capacity
        timestamp last_modified_at
        timestamp created_at
        int version
        boolean is_draft
        bigint parent_event_id
        enum approval_status
        simple-array tags
        enum status
    }
    
    SubEvent {
        bigint sub_event_id PK
        bigint event_id FK
        varchar name
        timestamp start_time
        timestamp end_time
        bigint thumbnail_image_id
        bigint cover_image_id
        simple-array image_gallery_ids
        int version
        boolean is_draft
        bigint parent_sub_event_id
        enum approval_status
        enum status
    }
    
    Venue {
        bigint venue_id PK
        varchar name
        text address
        varchar city
        varchar country
        varchar zip
        decimal latitude
        decimal longitude
        varchar venue_type
        boolean is_parking_available
        json seat_map
        enum status
    }
    
    EventVenue {
        bigint id PK
        bigint event_id FK
        bigint venue_id FK
    }
    
    ResourcePerson {
        bigint resource_person_id PK
        varchar name
        text description
        enum status
    }
    
    SubEventResourcePerson {
        bigint id PK
        bigint sub_event_id FK
        bigint resource_person_id FK
        bigint profile_image FK
        simple-array image_gallery_ids
    }
    
    TicketCategory {
        bigint ticket_category_id PK
        bigint event_id FK
        varchar name
        text description
        decimal base_price
        int max_quantity
        int min_quantity
        varchar status
        text seat_map
    }
    
    Ticket {
        bigint ticket_id PK
        bigint ticket_category_id FK
        bigint user_id FK
        varchar qr_code_url
        varchar ticket_number UK
        boolean is_checked_in
        bigint booking_id FK
        enum status
    }
    
    TicketSubEvent {
        bigint id PK
        bigint ticket_category_id FK
        bigint sub_event_id FK
        enum status
    }
    
    Booking {
        bigint booking_id PK
        bigint user_id FK
        bigint event_id FK
        enum status
        boolean is_test
        varchar referrer
        timestamp booking_time
        decimal total_amount
        enum payment_status
    }
    
    Payment {
        bigint payment_id PK
        bigint booking_id FK
        varchar payment_method
        decimal amount
        timestamp payment_time
        enum status
        varchar gateway_reference_id
        varchar gateway_name
    }
    
    Refund {
        bigint refund_id PK
        bigint payment_id FK
        decimal refund_amount
        timestamp refund_time
        enum status
        bigint refunded_by FK
    }
    
    Promotion {
        bigint promotion_id PK
        bigint event_id FK
        varchar name
        varchar code UK
        decimal max_discount_amount
        varchar discount_type
        decimal discount_value
        timestamp valid_from
        timestamp valid_to
        int max_uses
        int max_uses_per_user
        decimal min_purchase_amount
        simple-array applicable_ticket_categories
        varchar promotion_type
        enum promotion_status
        boolean is_stackable
        boolean is_active
        varchar color_name
        varchar color_code
        timestamp created_at
        bigint created_by FK
    }
    
    Approval {
        bigint approval_id PK
        bigint change_request_id FK
        bigint approver_id FK
        timestamp approved_at
        enum approval_status
        text approval_notes
    }
    
    ChangeRequest {
        bigint change_request_id PK
        enum entity_type
        bigint original_entity_id
        bigint draft_entity_id
        bigint submitted_by FK
        timestamp submitted_at
        enum approval_status
        bigint approval_id FK
        text notes
    }
    
    File {
        bigint file_id PK
        bigint event_id FK
        bigint resource_person_id FK
        varchar file_type
        timestamp uploaded_at
        varchar file_url
    }
