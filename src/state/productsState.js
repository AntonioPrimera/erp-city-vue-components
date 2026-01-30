import { reactive } from 'vue';
import axios from 'axios';
import { route } from 'ziggy-js';

export const productsState = reactive({
    products: [],
    loading: false,
    error: null,
    loaded: false,

    getProduct(id) {
        return this.products.find(product => product.id === id);
    },

    async loadProducts() {
        this.loading = true;
        this.error = null;

        try {
            const { data } = await axios.get(route('products.index'));
            this.products = Array.isArray(data) ? data : [];
            this.loaded = true;
        } catch (error) {
            this.error = error?.response?.data?.message || 'Nu am putut încărca produsele.';
            throw error;
        } finally {
            this.loading = false;
        }
    },

    async ensureLoaded() {
        if (this.loaded || this.loading) {
            return;
        }

        try {
            await this.loadProducts();
        } catch (error) {
            // Errors are stored on state; callers can check productsState.error.
        }
    },

    reset() {
        this.products = [];
        this.loading = false;
        this.error = null;
        this.loaded = false;
    },
});
