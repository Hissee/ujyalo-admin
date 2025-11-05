import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endpoints } from '../const/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  // Dashboard Stats
  getDashboardStats(): Observable<any> {
    return this.http.get(Endpoints.ADMIN_DASHBOARD_STATS);
  }

  // User Management
  getAllUsers(params?: any): Observable<any> {
    return this.http.get(Endpoints.ADMIN_USERS, { params });
  }

  updateUserStatus(userId: string, status: { deactivated?: boolean; emailVerified?: boolean }): Observable<any> {
    return this.http.put(Endpoints.ADMIN_UPDATE_USER_STATUS(userId), status);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(Endpoints.ADMIN_DELETE_USER(userId));
  }

  // Product Management
  getAllProducts(params?: any): Observable<any> {
    return this.http.get(Endpoints.ADMIN_PRODUCTS, { params });
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(Endpoints.ADMIN_DELETE_PRODUCT(productId));
  }

  // Order Management
  getAllOrders(params?: any): Observable<any> {
    return this.http.get(Endpoints.ADMIN_ORDERS, { params });
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(Endpoints.ADMIN_UPDATE_ORDER_STATUS(orderId), { status });
  }
}

