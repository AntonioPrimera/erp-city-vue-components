<script setup>
import {sidebarState} from "../state/sidebarState.js";
import {onMounted} from "vue";

onMounted(() => {
    sidebarState.setHeader('', false);
});
</script>

<template>
    <div class="flex flex-col items-center text-center pt-32">
        <svg width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M45.5 91C70.629 91 91 70.629 91 45.5C91 20.371 70.629 0 45.5 0C20.371 0 0 20.371 0 45.5C0 70.629 20.371 91 45.5 91Z" fill="#028163"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M31.293 67.6904L14.6522 49.8798C12.374 47.4414 12.5047 43.5836 14.9431 41.3054C17.3815 39.0272 21.2393 39.1583 23.5175 41.5963L36.3535 55.3344L56.6713 36.3509C56.854 36.18 57.0449 36.0234 57.2423 35.8794L66.797 26.9525C69.2354 24.6742 73.0935 24.8054 75.3714 27.2437C77.6496 29.6818 77.5185 33.5399 75.0805 35.8182L45.8982 63.0841L45.867 63.0508L35.7724 72.4826L31.293 67.6904Z" fill="white"/>
        </svg>

        <h3 class="mt-6 mb-4">Solicitarea a fost trimisă cu succes!</h3>
        <div class="text-lg lg:text-xl max-w-sm mb-10">
            Mulțumim pentru încredere. Vom procesa solicitarea ta cât mai curând și te vom contacta pentru confirmare.
        </div>
        <button type="button"
                class="btn btn-secondary btn-full"
                @click="sidebarState.close()"
        >
            Închide
        </button>
    </div>
</template>


