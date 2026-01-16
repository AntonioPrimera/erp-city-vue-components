<script setup>
import { computed, onMounted } from 'vue';
import { ordersState } from '../state/ordersState.js';
import { sidebarState } from '../state/sidebarState.js';

const orders = computed(() => ordersState.orders);
const isLoading = computed(() => ordersState.loading);
const error = computed(() => ordersState.error);

function formatDate(value) {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    return date.toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function formatCurrency(amount, currency) {
    if (amount === null || amount === undefined) {
        return '-';
    }

    const value = Number(amount);

    if (Number.isNaN(value)) {
        return '-';
    }

    return `${value.toFixed(2)} ${currency || 'RON'}`;
}

onMounted(() => {
    sidebarState.setHeader('Comenzile mele', true);

    if (!ordersState.orders.length && !ordersState.loading) {
        ordersState.fetchOrders();
    }
});
</script>

<template>
    <div class="flex flex-col min-h-[calc(100vh-228px)]">
        <div v-if="isLoading" class="text-gray-500 text-sm mt-4">
            Se încarcă comenzile...
        </div>

        <div v-else-if="error" class="text-red-600 text-sm mt-4">
            {{ error }}
        </div>

        <div v-else-if="!orders.length" class="text-gray-500 text-sm mt-4">
            Nu ai plasat încă nicio comandă.
        </div>

        <div v-else class="space-y-4 flex-1 overflow-y-auto">
            <div v-for="order in orders" :key="order.id" class="pt-4 border border-neutral-300 rounded-lg p-4">
                <div class="flex items-center justify-between pb-4 border-b border-neutral-300">
                    <div class="font-medium">
                        Comanda nr. #{{ order.id }} · <span class="text-neutral-500">{{ formatDate(order.date) }}</span>
                    </div>
                    <div class="font-semibold">
                        {{ formatCurrency(order.total, order.currency) }}
                    </div>
                </div>

                <div class="text-sm text-neutral-700 mt-4">
                    <span class="font-medium">Produse: </span>
                </div>

                <div v-if="order.items?.length" class="mt-2 text-sm text-neutral-600 space-y-1">
                    <div
                        v-for="(item, index) in order.items"
                        :key="`${order.id}-${index}`"
                        class="flex items-center justify-between"
                    >
                        <div>
                            {{ item.name || 'Produs' }}
                            <span v-if="item.quantity">({{ item.quantity }} buc)</span>
                        </div>
                        <div>
                            {{ formatCurrency(item.price * item.quantity, item.currency || order.currency) }}
                        </div>
                    </div>
                </div>

                <div v-else>-</div>

                <div class="text-sm text-neutral-600 mt-3">
                    <span class="font-medium">Status: </span>
                    {{ order.status?.label || '-' }}
                </div>
                <div class="text-sm text-neutral-600 mt-2">
                    <span class="font-medium">Plată: </span>
                    {{ order.payment_type?.label || '-' }}
                </div>

                <div class="mt-3 text-sm text-neutral-600 space-y-1">
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Subtotal:</span>
                        <span>{{ formatCurrency(order.subtotal, order.currency) }}</span>
                    </div>
                    <div v-if="order.discount_percent" class="text-sm text-neutral-600 mt-2">
                        <span class="font-medium">Discount:</span>
                        {{ order.discount_percent }}%
                        <span v-if="order.coupon_code">({{ order.coupon_code }})</span>
                    </div>
                    <div v-if="order.discount_percent" class="flex items-center justify-between">
                        <span class="font-medium">Reducere:</span>
                        <span>-{{ formatCurrency(order.subtotal - order.total, order.currency) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-medium">Total final:</span>
                        <span>{{ formatCurrency(order.total, order.currency) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
