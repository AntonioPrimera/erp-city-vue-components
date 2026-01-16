<script setup>
import {ref, watch} from "vue";

const emits = defineEmits(['update:model-value']);
let quantity = ref(1);

watch(quantity, (newValue) => {
    emits('update:model-value', newValue);
});

const props = defineProps({
    modelValue: {
        type: Number,
        default: 1
    }
});

watch(() => props.modelValue, (newValue) => {
    quantity.value = newValue;
});
</script>

<template>
    <div class="flex text-gray-500">
        <button class="cursor-pointer hover:bg-gray-100 active:bg-gray-200 h-11 w-8.5 border border-gray-200 rounded-l flex items-center justify-center"
                :disabled="quantity <= 1"
                @click="quantity = quantity > 1 ? quantity - 1 : 1"
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3333 7.33334H2.66667C2.29867 7.33334 2 7.63201 2 8.00001C2 8.36801 2.29867 8.66668 2.66667 8.66668H13.3333C13.7013 8.66668 14 8.36801 14 8.00001C14 7.63201 13.7013 7.33334 13.3333 7.33334Z" fill="#6E7077"/>
            </svg>
        </button>

        <input id="quantity" label="Cantitate" class="h-11 w-12 lg:w-16 flex border-t border-b border-gray-200 items-center text-center justify-center text-lg lg:text-xl" v-model="quantity">

        <button class="cursor-pointer hover:bg-gray-100 active:bg-gray-200 h-11 w-8.5 border border-gray-200 rounded-r flex items-center justify-center"
                @click="quantity++"
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3333 7.33333H8.66667V2.66667C8.66667 2.29867 8.368 2 8 2C7.632 2 7.33333 2.29867 7.33333 2.66667V7.33333H2.66667C2.29867 7.33333 2 7.632 2 8C2 8.368 2.29867 8.66667 2.66667 8.66667H7.33333V13.3333C7.33333 13.7013 7.632 14 8 14C8.368 14 8.66667 13.7013 8.66667 13.3333V8.66667H13.3333C13.7013 8.66667 14 8.368 14 8C14 7.632 13.7013 7.33333 13.3333 7.33333Z" fill="#6E7077"/>
            </svg>
        </button>
    </div>
</template>
