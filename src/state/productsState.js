import { reactive } from 'vue';
import axios from 'axios';
import { route } from 'ziggy-js';

export const productsState = reactive({
    products: [],
    loaded: false,

    getProduct(id) {
        return this.products.find(product => product.id === id);
    },

    async loadProducts() {
        const { data } = await axios.get(route('products.index'));
        this.products = Array.isArray(data) ? data : [];
        this.loaded = true;
    },

    async ensureLoaded() {
        if (this.loaded) {
            return;
        }

        await this.loadProducts();
    },

    reset() {
        this.products = [];
        this.loaded = false;
    },
});
