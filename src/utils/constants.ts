export const EVENT_TYPES = [
  'user.login',
  'user.logout',
  'data.create',
  'data.update',
  'data.delete',
  'system.error',
  'system.warning',
  'api.request',
  'api.response',
  'payment.success'
] as const;

export const SOURCE_APPS = [
  'auth-service',
  'payment-service',
  'user-service',
  'data-service',
  'api-gateway'
] as const;