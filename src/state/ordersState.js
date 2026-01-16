import { reactive } from 'vue';
import axios from 'axios';
import { route } from 'ziggy-js';

export const ordersState = reactive({
    orders: [],
    loading: false,
    error: null,

    setOrders(orders = []) {
        if (! Array.isArray(orders)) {
            this.orders = [];
            return;
        }

        this.orders = orders;
    },

    reset() {
        this.orders = [];
        this.error = null;
        this.loading = false;
    },

    async fetchOrders() {
        this.loading = true;
        this.error = null;

        try {
            const { data } = await axios.get(route('erp.account.orders.index'));
            this.setOrders(data.orders);
        } catch (error) {
            if (error.response?.status === 401) {
                this.reset();
            } else {
                this.error = error.response?.data?.message || 'Nu am putut încărca comenzile.';
            }
        } finally {
            this.loading = false;
        }
    },
});
