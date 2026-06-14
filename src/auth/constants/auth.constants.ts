export const ROLE_CODES = {
  SUPER_ADMIN: 1000,
  ADMIN: 1001,
  ACCOUNTANT: 1002,
  ORDER_MANAGER: 1003,
  PRODUCT_MANAGER: 1004,
  VENDOR: 1005,
  CUSTOMER: 1006,
} as const;

export const USER_STATUS = {
  PENDING_APPROVAL: 0,
  APPROVED: 1,
  REJECTED: 2,
  SUSPENDED: 3,
} as const;

export const DEFAULT_ROLES = [
  {
    roleCode: ROLE_CODES.SUPER_ADMIN,
    roleName: 'Super Admin',
    roleDesc: 'Full platform administrator access',
  },
  {
    roleCode: ROLE_CODES.ADMIN,
    roleName: 'Admin',
    roleDesc: 'Administrative platform access',
  },
  {
    roleCode: ROLE_CODES.ACCOUNTANT,
    roleName: 'Accountant',
    roleDesc: 'Finance and accounting access',
  },
  {
    roleCode: ROLE_CODES.ORDER_MANAGER,
    roleName: 'Order Manager',
    roleDesc: 'Order operations access',
  },
  {
    roleCode: ROLE_CODES.PRODUCT_MANAGER,
    roleName: 'Product Manager',
    roleDesc: 'Product catalog management access',
  },
  {
    roleCode: ROLE_CODES.VENDOR,
    roleName: 'Vendor',
    roleDesc: 'Vendor marketplace access',
  },
  {
    roleCode: ROLE_CODES.CUSTOMER,
    roleName: 'Customer',
    roleDesc: 'Customer account access',
  },
] as const;

export const DEFAULT_SUPER_ADMIN = {
  email: 'admin@gmail.com',
  password: '1234567890',
  firstName: 'Super',
  lastName: 'Admin',
} as const;
