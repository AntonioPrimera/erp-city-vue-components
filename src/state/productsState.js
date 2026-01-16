import { reactive } from 'vue';
import axios from 'axios';
import { route } from 'ziggy-js';

export const productsState = reactive({
    products: [],

    getProduct(id) {
        return this.products.find(product => product.id === id);
    },

    async loadProducts() {
        const { data } = await axios.get(route('products.index'));
        this.products = data;
    }
});
