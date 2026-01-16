<script setup>
import { favoritesState } from '../state/favoritesState.js';
import {route} from "ziggy-js";

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
});

async function removeFromFavorites() {
    await favoritesState.toggle(props.product.id);
}

</script>

<template>
    <div class="flex items-center py-4">
        <a :href="route('shop.products.show', product.id)">
            <img class="w-24 h-24 object-contain cursor-pointer" :src="product.icon_url || product.image" :alt="product.name">
        </a>
        <a class="ml-15 flex-1 cursor-pointer" :href="route('shop.products.show', product.id)">
            <div class="font-bold text-xl lg:text-2xl mb-1.5">{{ product.name }}</div>
            <p class="text-sm text-gray-500 line-clamp-2">{{ product.description }}</p>
        </a>
        <div class="ml-auto flex flex-col justify-between">
            <div class="ml-auto hover:brightness-90 cursor-pointer" @click.stop="removeFromFavorites">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.33398 1.66667L7.50065 2.50001H4.16732C3.70732 2.50001 3.33398 2.87334 3.33398 3.33334C3.33398 3.79334 3.70732 4.16667 4.16732 4.16667H5.83398H14.1673H15.834C16.294 4.16667 16.6673 3.79334 16.6673 3.33334C16.6673 2.87334 16.294 2.50001 15.834 2.50001H12.5007L11.6673 1.66667H8.33398ZM4.16732 5.83334V16.6667C4.16732 17.5875 4.91315 18.3333 5.83398 18.3333H14.1673C15.0882 18.3333 15.834 17.5875 15.834 16.6667V5.83334H4.16732Z" fill="#C73838"/>
                </svg>
            </div>
        </div>
    </div>
</template>
