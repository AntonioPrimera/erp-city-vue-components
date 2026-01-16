<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {productsState} from "../state/productsState.js";
import {cartState} from "../state/cartState.js";

import QuantityInput from "./QuantityInput.vue";

//--- Props -----------------------------------------------------------------------------------------------------------
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
});

//--- Data ------------------------------------------------------------------------------------------------------------
let quantity = ref(null);
const product = computed(() => productsState.getProduct(props.item.id));

//--- Watch -----------------------------------------------------------------------------------------------------------
watch(quantity, (newQuantity, oldQuantity) => {
    if (newQuantity !== oldQuantity)
        cartState.updateQuantity(props.item.id, newQuantity, props.item.price);
});

watch(() => props.item.quantity, (newQty) => {
    quantity.value = newQty;
});

//--- Mounted ---------------------------------------------------------------------------------------------------------
onMounted(() => {
    quantity.value = props.item.quantity;
});
</script>

<template>
    <div class="flex items-center pb-4">
        <img v-if="product.icon_url"
             class="w-24 h-24 object-contain"
             :src="product.icon_url"
             :alt="product.name"
        >
        <div v-else class="w-24 h-24">

        </div>
        <div class="ml-15">
            <div class="font-bold text-xl lg:text-2xl mb-1.5">{{ product.name }}</div>
            <div v-if="product.price && product.price > 0"
                 class="text-lg lg:text-xl"
            >
                {{ product.price }} {{ product.currency }}/buc
            </div>
        </div>
        <div class="ml-auto flex flex-col justify-between">
            <!-- Delete icon ------------------------------------------------------------------------------------->
            <div class="ml-auto hover:brightness-90 cursor-pointer mb-8"
                 @click="cartState.removeItem(props.item.id)"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.33398 1.66667L7.50065 2.50001H4.16732C3.70732 2.50001 3.33398 2.87334 3.33398 3.33334C3.33398 3.79334 3.70732 4.16667 4.16732 4.16667H5.83398H14.1673H15.834C16.294 4.16667 16.6673 3.79334 16.6673 3.33334C16.6673 2.87334 16.294 2.50001 15.834 2.50001H12.5007L11.6673 1.66667H8.33398ZM4.16732 5.83334V16.6667C4.16732 17.5875 4.91315 18.3333 5.83398 18.3333H14.1673C15.0882 18.3333 15.834 17.5875 15.834 16.6667V5.83334H4.16732Z" fill="#C73838"/>
                </svg>
            </div>

            <quantity-input v-if="product.price && product.price > 0"
                            v-model="quantity"
            ></quantity-input>
        </div>
    </div>
</template>
