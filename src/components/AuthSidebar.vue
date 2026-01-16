<script setup>
import { ref, computed, watch } from 'vue';
import { authState } from '../state/authState.js';
import { favoritesState } from '../state/favoritesState.js';
import { ordersState } from '../state/ordersState.js';
import { sidebarState } from '../state/sidebarState.js';
import { erpCityUiConfig } from '../config.js';

const mode = ref('login');
const form = ref({
    email: '',
    password: '',
    password_confirmation: '',
    name: '',
});
const formErrors = ref({});
const generalError = ref('');
const isLoadingFavorites = computed(() => favoritesState.loading);
const isLoadingOrders = computed(() => ordersState.loading);
const showFavorites = computed(() => erpCityUiConfig.showFavorites);
const showOrders = computed(() => erpCityUiConfig.showOrders);

const sidebarTitle = computed(() => {
    if (authState.isAuthenticated) {
        return 'Contul meu';
    }

    return mode.value === 'login' ? 'Intră în cont' : 'Creează cont';
});

watch(sidebarTitle, (title) => {
    sidebarState.setHeader(title, false);
});

sidebarState.setHeader(sidebarTitle.value, false);

function resetForm() {
    form.value = {
        email: '',
        password: '',
        password_confirmation: '',
        name: '',
    };
    formErrors.value = {};
    generalError.value = '';
}

async function onSubmit() {
    formErrors.value = {};
    generalError.value = '';

    try {
        if (mode.value === 'login') {
            await authState.login({
                email: form.value.email,
                password: form.value.password,
            });
        } else {
            await authState.register({
                name: form.value.name,
                email: form.value.email,
                password: form.value.password,
                password_confirmation: form.value.password_confirmation,
            });
        }

        const nextView = sidebarState.nextView;
        sidebarState.nextView = null;
        resetForm();

        if (nextView) {
            sidebarState.open(nextView);
        }
    } catch (error) {
        const responseData = error.response?.data;
        const responseErrors = responseData?.errors;
        if (responseErrors) {
            formErrors.value = Object.fromEntries(
                Object.entries(responseErrors).map(([key, messages]) => [key, messages.join(' ')])
            );
        } else if (responseData?.message) {
            generalError.value = responseData.message;
        }
    }
}

function switchMode(newMode) {
    mode.value = newMode;
    resetForm();
}

function viewFavorites() {
    if (! showFavorites.value) {
        return;
    }
    favoritesState.fetchFavorites();
    sidebarState.setHeader('Produse favorite', true);
    sidebarState.open('favorites');
}

function viewOrders() {
    if (! showOrders.value) {
        return;
    }
    ordersState.fetchOrders();
    sidebarState.setHeader('Comenzile mele', true);
    sidebarState.open('orders');
}

async function onLogout() {
    await authState.logout();
    sidebarState.close();
}
</script>

<template>
    <div class="flex flex-col">
        <template v-if="!authState.isAuthenticated">
            <form @submit.prevent="onSubmit" class="flex flex-col flex-1">
                <div class="space-y-4">
                    <div v-if="mode === 'register'">
                        <v-input
                            id="name"
                            label="Nume complet"
                            :error="formErrors.name"
                            placeholder="Introduceți numele"
                            v-model="form.name"
                        />
                    </div>

                    <v-input
                        id="email"
                        label="Email"
                        :error="formErrors.email"
                        placeholder="email@example.com"
                        type="email"
                        v-model="form.email"
                    />

                    <v-input
                        id="password"
                        label="Parolă"
                        :error="formErrors.password"
                        placeholder="Parola"
                        type="password"
                        v-model="form.password"
                    />

                    <div v-if="mode === 'register'">
                        <v-input
                            id="password_confirmation"
                            label="Confirmă parola"
                            :error="formErrors.password_confirmation"
                            placeholder="Reintroduceți parola"
                            type="password"
                            v-model="form.password_confirmation"
                        />
                    </div>

                    <div class="mt-6 mb-2 text-right text-sm text-gray-600">
                        <div v-if="mode === 'register'">
                            Ai deja un cont? <span class="underline cursor-pointer" @click="switchMode('login')">Intră în cont</span>
                        </div>
                        <div v-else>
                            Nu ai un cont? <span class="underline cursor-pointer" @click="switchMode('register')">Înregistrează-te</span>
                        </div>
                    </div>
                </div>

                <div v-if="generalError" class="text-red-600 text-sm mb-4">
                    {{ generalError }}
                </div>

                <button type="submit" class="btn btn-primary btn-full mt-auto" :disabled="authState.status === 'loading'">
                    {{ mode === 'login' ? 'Autentifică-te' : 'Înregistrează-te' }}
                </button>
            </form>
        </template>

        <template v-else>
            <div class="h-full flex flex-col">
                <div class="-mt-10 mb-4">
                    <p class="text-sm text-gray-500 mb-1">Ești autentificat ca</p>
                    <p class="text-lg font-semibold">{{ authState.user?.name || [authState.user?.first_name, authState.user?.last_name].filter(Boolean).join(' ') }}</p>
                    <p class="text-gray-700">{{ authState.user?.email }}</p>
                </div>

                <div v-if="showFavorites" class="flex items-center justify-between  pb-8 pt-8 border-b border-b-neutral-200">
                    <h4 class="text-lg font-semibold">
                        Produse favorite
                        <span class="text-neutral-400 font-normal">
                            ({{ favoritesState.ids.length }})
                        </span>
                    </h4>
                    <button type="button" class="text-primary underline" @click="viewFavorites" :disabled="isLoadingFavorites">
                        Vezi
                    </button>
                </div>

                <div v-if="showOrders" class="flex items-center justify-between pb-8 pt-8 border-b border-b-neutral-200">
                    <h4 class="text-lg font-semibold">
                        Comenzile mele
                        <span class="text-neutral-400 font-normal">
                            ({{ ordersState.orders.length }})
                        </span>
                    </h4>
                    <button type="button" class="text-primary underline" @click="viewOrders" :disabled="isLoadingOrders">
                        Vezi
                    </button>
                </div>
            </div>

            <button class="btn btn-primary btn-full mt-8" @click="onLogout" :disabled="authState.status === 'loading'">
                Deconectează-te
            </button>
        </template>
    </div>
</template>
