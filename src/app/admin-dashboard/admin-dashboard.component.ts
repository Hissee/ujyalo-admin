import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { ConfirmationDialogService } from '../services/confirmation-dialog.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'overview' | 'users' | 'products' | 'orders' = 'overview';
  
  // Dashboard Stats
  stats: any = null;
  recentOrders: any[] = [];
  recentUsers: any[] = [];
  loadingStats = false;
  
  // Users
  users: any[] = [];
  loadingUsers = false;
  userSearch = '';
  userRoleFilter = '';
  userPage = 1;
  userLimit = 20;
  userTotal = 0;
  
  // Products
  products: any[] = [];
  loadingProducts = false;
  productSearch = '';
  productCategoryFilter = '';
  productPage = 1;
  productLimit = 20;
  productTotal = 0;
  
  // Orders
  orders: any[] = [];
  loadingOrders = false;
  orderStatusFilter = '';
  orderSearch = '';
  orderPage = 1;
  orderLimit = 20;
  orderTotal = 0;

  currentUser: any = null;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private toastService: ToastService,
    private confirmationDialog: ConfirmationDialogService,
    public router: Router
  ) {}

  ngOnInit() {
    // Check authentication
    if (!this.authService.isAuthenticated() || !this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadDashboardStats();
    this.loadUsers();
    this.loadProducts();
    this.loadOrders();
  }

  logout() {
    this.authService.logout();
    this.toastService.info('Logged out successfully');
    this.router.navigate(['/login']);
  }

  setActiveTab(tab: 'overview' | 'users' | 'products' | 'orders') {
    this.activeTab = tab;
  }

  // Dashboard Stats
  loadDashboardStats() {
    this.loadingStats = true;
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.recentOrders = data.recentOrders || [];
        this.recentUsers = data.recentUsers || [];
        this.loadingStats = false;
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        this.toastService.error('Failed to load dashboard statistics');
        this.loadingStats = false;
      }
    });
  }

  // User Management
  loadUsers() {
    this.loadingUsers = true;
    const params: any = {
      page: this.userPage,
      limit: this.userLimit
    };
    if (this.userRoleFilter) params.role = this.userRoleFilter;
    if (this.userSearch) params.search = this.userSearch;

    this.adminService.getAllUsers(params).subscribe({
      next: (data) => {
        this.users = data.users || [];
        this.userTotal = data.pagination?.total || 0;
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.toastService.error('Failed to load users');
        this.loadingUsers = false;
      }
    });
  }

  async updateUserStatus(userId: string, deactivated: boolean) {
    const action = deactivated ? 'deactivate' : 'activate';
    const confirmed = await this.confirmationDialog.show(
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      `Are you sure you want to ${action} this user?`,
      'Confirm',
      'Cancel'
    );

    if (!confirmed) return;

    this.adminService.updateUserStatus(userId, { deactivated }).subscribe({
      next: () => {
        this.toastService.success(`User ${action}d successfully`);
        this.loadUsers();
        this.loadDashboardStats();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to update user status');
      }
    });
  }

  async verifyUserEmail(userId: string) {
    this.adminService.updateUserStatus(userId, { emailVerified: true }).subscribe({
      next: () => {
        this.toastService.success('User email verified successfully');
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to verify user email');
      }
    });
  }

  async deleteUser(userId: string, userName: string) {
    const confirmed = await this.confirmationDialog.show(
      'Delete User',
      `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
      'Delete',
      'Cancel'
    );

    if (!confirmed) return;

    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.toastService.success('User deleted successfully');
        this.loadUsers();
        this.loadDashboardStats();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to delete user');
      }
    });
  }

  // Product Management
  loadProducts() {
    this.loadingProducts = true;
    const params: any = {
      page: this.productPage,
      limit: this.productLimit
    };
    if (this.productCategoryFilter) params.category = this.productCategoryFilter;
    if (this.productSearch) params.search = this.productSearch;

    this.adminService.getAllProducts(params).subscribe({
      next: (data) => {
        this.products = data.products || [];
        this.productTotal = data.pagination?.total || 0;
        this.loadingProducts = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.toastService.error('Failed to load products');
        this.loadingProducts = false;
      }
    });
  }

  async deleteProduct(productId: string, productName: string) {
    const confirmed = await this.confirmationDialog.show(
      'Delete Product',
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      'Delete',
      'Cancel'
    );

    if (!confirmed) return;

    this.adminService.deleteProduct(productId).subscribe({
      next: () => {
        this.toastService.success('Product deleted successfully');
        this.loadProducts();
        this.loadDashboardStats();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to delete product');
      }
    });
  }

  // Order Management
  loadOrders() {
    this.loadingOrders = true;
    const params: any = {
      page: this.orderPage,
      limit: this.orderLimit
    };
    if (this.orderStatusFilter) params.status = this.orderStatusFilter;
    if (this.orderSearch) params.search = this.orderSearch;

    this.adminService.getAllOrders(params).subscribe({
      next: (data) => {
        this.orders = data.orders || [];
        this.orderTotal = data.pagination?.total || 0;
        this.loadingOrders = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.toastService.error('Failed to load orders');
        this.loadingOrders = false;
      }
    });
  }

  updateOrderStatus(orderId: string, status: string) {
    this.adminService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.toastService.success('Order status updated successfully');
        this.loadOrders();
        this.loadDashboardStats();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to update order status');
      }
    });
  }

  formatCurrency(amount: number): string {
    return `Rs. ${amount?.toLocaleString('en-NP') || 0}`;
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

