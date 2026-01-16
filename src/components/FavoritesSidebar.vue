<script setup>
import { computed, onMounted } from 'vue';
import FavoriteProductCard from './FavoriteProductCard.vue';
import { favoritesState } from '../state/favoritesState.js';
import { productsState } from '../state/productsState.js';
import { sidebarState } from '../state/sidebarState.js';

const favoriteProducts = computed(() => favoritesState.ids
    .map(id => productsState.getProduct(id))
    .filter(Boolean));
const isLoading = computed(() => favoritesState.loading);
const error = computed(() => favoritesState.error);

onMounted(() => {
    sidebarState.setHeader('Produse favorite', true);

    if (! favoritesState.ids.length && ! favoritesState.loading) {
        favoritesState.fetchFavorites();
    }
});
</script>

<template>
    <div class="flex flex-col min-h-[calc(100vh-228px)]">
        <h4 class="text-lg font-semibold mb-6">Produse favorite</h4>

        <div v-if="isLoading" class="text-gray-500 text-sm mt-4">
            Se încarcă favoritele...
        </div>

        <div v-else-if="error" class="text-red-600 text-sm mt-4">
            {{ error }}
        </div>

        <div v-else-if="!favoriteProducts.length" class="text-gray-500 text-sm mt-4">
            Nu ai adăugat încă produse la favorite.
        </div>

        <div v-else class="space-y-4 divide-y divide-gray-200 flex-1 overflow-y-auto">
            <favorite-product-card
                v-for="product in favoriteProducts"
                :key="product.id"
                :product="product"
            ></favorite-product-card>
        </div>
    </div>
</template>
