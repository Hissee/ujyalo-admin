export class Endpoints {
  public static readonly API_BASE: string = 'http://localhost:3000/';
  public static readonly API_VERSION: string = 'api/';

  // Auth
  public static readonly LOGIN = Endpoints.API_BASE + Endpoints.API_VERSION + 'auth/login';
  public static readonly GET_CURRENT_USER = Endpoints.API_BASE + Endpoints.API_VERSION + 'auth/me';

  // Admin
  public static readonly ADMIN_DASHBOARD_STATS = Endpoints.API_BASE + Endpoints.API_VERSION + 'admin/dashboard/stats';
  public static readonly ADMIN_USERS = Endpoints.API_BASE + Endpoints.API_VERSION + 'admin/users';
  public static readonly ADMIN_UPDATE_USER_STATUS = (userId: string) =>
    Endpoints.API_BASE + Endpoints.API_VERSION + `admin/users/${userId}/status`;
  public static readonly ADMIN_DELETE_USER = (userId: string) =>
    Endpoints.API_BASE + Endpoints.API_VERSION + `admin/users/${userId}`;
  public static readonly ADMIN_PRODUCTS = Endpoints.API_BASE + Endpoints.API_VERSION + 'admin/products';
  public static readonly ADMIN_DELETE_PRODUCT = (productId: string) =>
    Endpoints.API_BASE + Endpoints.API_VERSION + `admin/products/${productId}`;
  public static readonly ADMIN_ORDERS = Endpoints.API_BASE + Endpoints.API_VERSION + 'admin/orders';
  public static readonly ADMIN_UPDATE_ORDER_STATUS = (orderId: string) =>
    Endpoints.API_BASE + Endpoints.API_VERSION + `admin/orders/${orderId}/status`;
}

