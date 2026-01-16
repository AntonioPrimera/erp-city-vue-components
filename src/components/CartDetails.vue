<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { sidebarState } from "../state/sidebarState.js";
import { cartState } from "../state/cartState.js";
import { authState } from "../state/authState.js";
import ProductCard from "./ProductCard.vue";

onMounted(() => {
    sidebarState.setHeader('Detalii coș', false);
});

const loginLabel = computed(() =>
    cartState.price ? 'Autentifică-te pentru plată' : 'Autentifică-te pentru ofertă'
);

const guestLabel = computed(() =>
    'Continuă ca invitat'
);

const couponCode = ref('');

function continueAsGuest() {
    sidebarState.open('address');
}

function openAuth() {
    sidebarState.nextView = 'address';
    sidebarState.open('auth');
}

async function applyCoupon() {
    await cartState.applyCoupon(couponCode.value);
}

async function clearCoupon() {
    await cartState.clearCoupon();
}

watch(
    () => cartState.coupon,
    (coupon) => {
        couponCode.value = coupon?.code ?? '';
    },
    { immediate: true }
);
</script>

<template>
    <div class="flex flex-col min-h-[calc(100vh-228px)]">
        <div class="space-y-4 divide-y divide-gray-200">
            <product-card v-for="item in cartState.items"
                          :item="item"
            ></product-card>
        </div>

        <div v-if="!cartState.items.length"
             class="text-center text-lg text-gray-500 mt-20"
        >
            Nu ai niciun produs în coșul tău.
        </div>

        <div v-if="cartState.subtotal"
             class="mt-auto flex items-center justify-between pt-6 pb-4 border-t border-gray-200"
        >
            <div class="text-xl lg:text-2xl font-medium">Subtotal</div>
            <div class="text-2xl lg:text-3xl">{{ cartState.subtotal }} RON</div>
        </div>

        <div
            v-if="cartState.coupon && cartState.subtotal"
            class="flex items-center justify-between pb-4 border-b border-gray-200"
        >
            <div class="text-lg lg:text-xl text-neutral-600">
                Reducere ({{ cartState.coupon.discountPercent }}%)
            </div>
            <div class="text-lg lg:text-xl text-neutral-600">-{{ cartState.discountAmount }} RON</div>
        </div>

        <div
            v-if="cartState.coupon && cartState.subtotal"
            class="flex items-center justify-between py-6"
        >
            <div class="text-xl lg:text-2xl font-medium">Total</div>
            <div class="text-2xl lg:text-3xl">{{ cartState.price }} RON</div>
        </div>

        <div v-if="cartState.items.length"
             class="pb-8 flex space-x-2 items-end"
        >
            <v-input
                id="coupon_code"
                label="Cupon reducere"
                placeholder="Introdu codul de reducere"
                :error="cartState.couponError"
                v-model="couponCode"
            ></v-input>

            <button
                type="button"
                class="p-3 border border-primary text-primary text-sm font-medium rounded-lg"
                :disabled="cartState.couponLoading || !couponCode"
                @click="applyCoupon"
            >
                Aplică
            </button>

            <button
                v-if="cartState.coupon"
                type="button"
                class="p-3 border border-red-600 text-red-600 text-sm font-medium rounded-lg"
                @click="clearCoupon"
            >
                Elimină
            </button>
        </div>

        <div class="mt-auto border-t-2 border-t-neutral-200 pt-10">
            <button
                v-if="authState.isAuthenticated"
                type="button"
                class="btn btn-primary btn-full mb-2 lg:mb-6"
                :disabled="!cartState.items.length"
                @click="sidebarState.open('address')"
            >
                {{ cartState.price ? 'Continuă spre plată' : 'Solicită ofertă' }}
            </button>

            <div
                v-else
                class="flex flex-col gap-4 text-center"
            >
                <button
                    type="button"
                    class="btn btn-primary btn-full"
                    :disabled="!cartState.items.length"
                    @click="openAuth"
                >
                    {{ loginLabel }}
                </button>
                <div class="text-sm text-neutral-500">sau</div>
                <button
                    type="button"
                    class="btn btn-secondary btn-full"
                    :disabled="!cartState.items.length"
                    @click="continueAsGuest"
                >
                    {{ guestLabel }}
                </button>
            </div>
        </div>
    </div>
</template>
