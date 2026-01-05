import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import cartService from '../services/cartService';
import productService from '../services/productService';
import orderService from '../services/orderService';

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: null,
      cartSummary: { itemCount: 0, subtotal: 0 },
      isLoading: false,
      error: null,

      // Actions
      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartService.getCart();
          set({ cart: response.data, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      addToCart: async (productId, quantity = 1, variant = null) => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartService.addToCart(productId, quantity, variant);
          set({ cart: response.data, isLoading: false });
          get().updateCartSummary();
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateCartItem: async (itemId, quantity) => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartService.updateCartItem(itemId, quantity);
          set({ cart: response.data, isLoading: false });
          get().updateCartSummary();
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      removeFromCart: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartService.removeFromCart(itemId);
          set({ cart: response.data, isLoading: false });
          get().updateCartSummary();
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          await cartService.clearCart();
          set({ cart: null, cartSummary: { itemCount: 0, subtotal: 0 }, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateCartSummary: () => {
        const { cart } = get();
        if (cart) {
          set({
            cartSummary: {
              itemCount: cart.itemCount || 0,
              subtotal: cart.subtotal || 0
            }
          });
        }
      },

      mergeCart: async (guestSessionId) => {
        try {
          const response = await cartService.mergeCart(guestSessionId);
          set({ cart: response.data });
          get().updateCartSummary();
        } catch (error) {
          console.error('Failed to merge cart:', error);
        }
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartSummary: state.cartSummary })
    }
  )
);

// Product Store
export const useProductStore = create((set, get) => ({
  products: [],
  featuredProducts: [],
  currentProduct: null,
  relatedProducts: [],
  categories: [],
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: '-createdAt'
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  },
  isLoading: false,
  error: null,

  // Actions
  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProducts({
        ...get().filters,
        ...get().pagination,
        ...params
      });
      set({
        products: response.data.docs,
        pagination: {
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.totalDocs,
          totalPages: response.data.totalPages
        },
        isLoading: false
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchFeaturedProducts: async (limit = 8) => {
    try {
      const response = await productService.getFeaturedProducts(limit);
      set({ featuredProducts: response.data });
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    }
  },

  fetchProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProduct(id);
      set({ currentProduct: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchProductBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProductBySlug(slug);
      set({ currentProduct: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchRelatedProducts: async (productId, limit = 4) => {
    try {
      const response = await productService.getRelatedProducts(productId, limit);
      set({ relatedProducts: response.data });
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    }
  },

  updateFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
  },

  updatePagination: (newPagination) => {
    set({ pagination: { ...get().pagination, ...newPagination } });
  },

  searchProducts: async (query) => {
    set({ filters: { ...get().filters, search: query } });
    get().fetchProducts();
  },

  clearFilters: () => {
    set({
      filters: {
        category: '',
        minPrice: '',
        maxPrice: '',
        search: '',
        sort: '-createdAt'
      }
    });
  }
}));

// UI Store
export const useUIStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarOpen: false,
      mobileMenuOpen: false,
      cartDrawerOpen: false,
      searchModalOpen: false,
      currency: 'USD',
      language: 'en',
      notifications: [],

      // Actions
      toggleTheme: () => {
        set({ theme: get().theme === 'light' ? 'dark' : 'light' });
      },

      toggleSidebar: () => {
        set({ sidebarOpen: !get().sidebarOpen });
      },

      toggleMobileMenu: () => {
        set({ mobileMenuOpen: !get().mobileMenuOpen });
      },

      toggleCartDrawer: () => {
        set({ cartDrawerOpen: !get().cartDrawerOpen });
      },

      toggleSearchModal: () => {
        set({ searchModalOpen: !get().searchModalOpen });
      },

      setCurrency: (currency) => {
        set({ currency });
      },

      setLanguage: (language) => {
        set({ language });
      },

      addNotification: (notification) => {
        const id = Date.now();
        set({
          notifications: [...get().notifications, { ...notification, id }]
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },

      removeNotification: (id) => {
        set({
          notifications: get().notifications.filter(n => n.id !== id)
        });
      },

      clearNotifications: () => {
        set({ notifications: [] });
      }
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        currency: state.currency,
        language: state.language
      })
    }
  )
);