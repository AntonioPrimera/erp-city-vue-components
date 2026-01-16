<script setup>
import { computed } from 'vue';
import {authState} from "../state/authState.js";
import {sidebarState} from "../state/sidebarState.js";

const iconSrc = '/img/icons/auth.svg';
const initials = computed(() => {
    const name = authState.user?.name || [authState.user?.first_name, authState.user?.last_name].filter(Boolean).join(' ');
    if (! name) {
        return '';
    }

    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase())
        .join('');
});

function openAuthSidebar() {
    sidebarState.setHeader(authState.isAuthenticated ? 'Contul meu' : 'Intră în cont', false);
    sidebarState.open('auth');
}
</script>

<template>
    <button type="button"
            class="cursor-pointer flex items-center justify-center ml-4"
            :class="{'bg-primary text-white rounded-full h-8 w-8' : authState.isAuthenticated}"
            @click="openAuthSidebar">
        <span v-if="authState.isAuthenticated" class="text-sm font-semibold">{{ initials }}</span>
        <img v-else :src="iconSrc" alt="Profil" class="h-5.5 w-5.5" />
    </button>
</template>
