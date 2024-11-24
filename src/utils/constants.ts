export const EVENT_TYPES = [
  'user.login',  // User login event
  'user.logout',  // User logout event
  'data.create',  // Data creation event
  'data.update',  // Data update event
  'data.delete',  // Data deletion event
  'system.error',  // System error event
  'system.warning',  // System warning event
  'api.request',  // API request event
  'api.response',  // API response event
  'payment.success'  // Successful payment event
] as const;  // The 'as const' assertion makes each item in the array a unique type

// Defining a constant array of source application identifiers, ensuring that the values are treated as literal types
export const SOURCE_APPS = [
  'auth-service',  // Authentication service
  'payment-service',  // Payment service
  'user-service',  // User service
  'data-service',  // Data service
  'api-gateway'  // API gateway service
] as const;  // The 'as const' assertion makes each item in the array a unique type
