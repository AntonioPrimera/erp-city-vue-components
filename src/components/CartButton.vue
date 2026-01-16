<script setup>
import { cartState, sidebarState } from "erp-city-vue-components";

const cartIconSrc = '/img/icons/cart.svg';
</script>

<template>
    <div class="block relative ml-auto cursor-pointer"
         @click="sidebarState.open('cart')"
    >
        <div v-if="cartState.count"
             class="absolute bottom-3 left-3 flex items-center justify-center rounded-full bg-[#C73838] w-5.5 h-5.5 text-white text-center"
        >
            {{ cartState.count}}
        </div>
        <img :src="cartIconSrc" alt="Cart">
    </div>
</template>
