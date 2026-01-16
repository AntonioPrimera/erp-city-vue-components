import { reactive } from 'vue';
import axios from 'axios';
import { route } from 'ziggy-js';
import {productsState} from "./productsState.js";

export const cartState = reactive({
    items: [],
    coupon: null,
    couponError: null,
    couponLoading: false,

    get count() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    get subtotal() {
        return this.items.reduce((sum, item) => {
            const product = productsState.getProduct(item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
    },

    get discountAmount() {
        if (!this.coupon || !this.subtotal) {
            return 0;
        }

        const percent = this.coupon.discountPercent ?? 0;
        return (this.subtotal * percent) / 100;
    },

    get price() {
        return Math.max(0, this.subtotal - this.discountAmount);
    },

    setCart(newCart) {
        this.items = newCart;
    },

    async loadCart() {
        const { data } = await axios.get(route('erp.cart.index'));
        this.setCart(data);
    },

    async addToCart(productId, quantity = 1, price) {
        const { data } = await axios.post(route('erp.cart.add'), { id: productId, quantity, price });
        this.setCart(data);
    },

    async updateQuantity(productId, quantity, price) {
        const { data } = await axios.post(route('erp.cart.update'), { id: productId, quantity, price });
        this.setCart(data);
    },

    async removeItem(productId) {
        const { data } = await axios.delete(route('erp.cart.remove', productId));
        this.setCart(data);
    },

    async clearCart() {
        const { data } = await axios.delete(route('erp.cart.clear'));
        this.setCart(data);
        this.coupon = null;
        this.couponError = null;
    },

    async applyCoupon(code) {
        const normalized = (code || '').trim();
        this.couponError = null;

        if (!normalized) {
            this.coupon = null;
            return;
        }

        this.couponLoading = true;

        try {
            const { data } = await axios.post(route('erp.cart.coupon.apply'), { code: normalized });
            const coupon = data?.data;
            this.coupon = coupon
                ? {
                    code: coupon.code,
                    discountPercent: coupon.discount_percent,
                }
                : null;
        } catch (error) {
            const message = error?.response?.data?.message || 'Cupon invalid.';
            this.couponError = message;
            this.coupon = null;
        } finally {
            this.couponLoading = false;
        }
    },

    async clearCoupon() {
        this.coupon = null;
        this.couponError = null;

        try {
            await axios.delete(route('erp.cart.coupon.clear'));
        } catch (error) {
            console.warn('Failed to clear coupon', error);
        }
    },
});
