// User Roles
const ROLES = {
    ADMIN: 'admin',
    AUTHOR: 'author',
    VIEWER: 'viewer',
    CUSTOMER: 'customer',
    VENDOR: 'vendor',
    MANAGER: 'manager'
};

// User Status
const USER_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended'
};

// Permissions by Role
const PERMISSIONS = {
    [ROLES.ADMIN]: [
        'manage_users',
        'manage_posts',
        'manage_comments',
        'view_analytics',
        'approve_users',
        'delete_users',
        'manage_products',
        'manage_orders',
        'manage_categories',
        'view_reports',
        'manage_settings',
        'manage_payments'
    ],
    [ROLES.MANAGER]: [
        'manage_products',
        'manage_orders',
        'view_analytics',
        'manage_categories',
        'view_reports'
    ],
    [ROLES.VENDOR]: [
        'create_product',
        'edit_own_product',
        'delete_own_product',
        'view_own_products',
        'view_own_orders'
    ],
    [ROLES.AUTHOR]: [
        'create_post',
        'edit_own_post',
        'delete_own_post',
        'view_own_posts'
    ],
    [ROLES.CUSTOMER]: [
        'view_products',
        'add_to_cart',
        'place_order',
        'view_own_orders',
        'add_review',
        'view_posts',
        'add_comment'
    ],
    [ROLES.VIEWER]: [
        'view_posts',
        'add_comment',
        'like_post',
        'view_products'
    ]
};

// Order Status
const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
};

// Payment Status
const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    PARTIALLY_REFUNDED: 'partially_refunded'
};

// Product Status
const PRODUCT_STATUS = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    ARCHIVED: 'archived'
};

// HTTP Status Codes
const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_ERROR: 500,
    SERVER_ERROR: 500
};

module.exports = {
    ROLES,
    USER_STATUS,
    PERMISSIONS,
    STATUS_CODES,
    ORDER_STATUS,
    PAYMENT_STATUS,
    PRODUCT_STATUS
};
