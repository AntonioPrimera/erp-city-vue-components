<script setup>
import { sidebarState } from '../state/sidebarState.js';
import { erpCityUiConfig } from '../config.js';

import AddressForm from "./AddressForm.vue";
import CartDetails from "./CartDetails.vue";
import OrderConfirmation from "./OrderConfirmation.vue";
import PaymentOrderConfirmation from "./PaymentOrderConfirmation.vue";
import AuthSidebar from "./AuthSidebar.vue";
import FavoritesSidebar from "./FavoritesSidebar.vue";
import OrdersSidebar from "./OrdersSidebar.vue";
</script>

<template>
    <div v-if="sidebarState.isOpen"
         class="bg-white z-30 px-6 py-6 fixed right-0 w-full max-w-[42rem] shadow-lg overflow-y-auto"
    >
        <!-- Header -------------------------------------------------------------------------------------------------->
        <div class="flex items-center justify-between mb-15">
            <!-- Back icon ------------------------------------------------------------------------------------------->
            <div v-if="sidebarState.withBack"
                 class="cursor-pointer"
                 @click="sidebarState.goBack()"
            >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3324 7.1224C12.9912 7.1224 12.6497 7.25496 12.3897 7.51563L4.84803 15.0573C4.3267 15.5786 4.3267 16.4227 4.84803 16.9427L12.3897 24.4844C12.911 25.0057 13.7551 25.0057 14.2751 24.4844L14.3897 24.3698C14.911 23.8485 14.911 23.0044 14.3897 22.4844L9.23866 17.3333H26.6657C27.4017 17.3333 27.9991 16.736 27.9991 16C27.9991 15.264 27.4017 14.6667 26.6657 14.6667H9.23866L14.3897 9.51563C14.911 8.99429 14.911 8.15021 14.3897 7.63021L14.2751 7.51563C14.0144 7.25496 13.6736 7.1224 13.3324 7.1224Z" fill="black"/>
                </svg>
            </div>

            <!-- Title ----------------------------------------------------------------------------------------------->
            <h3>
                {{ sidebarState.title }}
            </h3>

            <!-- Close icon ------------------------------------------------------------------------------------------>
            <div class="cursor-pointer"
                 @click="sidebarState.close()"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.99105 3.99024C4.79212 3.99029 4.59772 4.04967 4.43271 4.16079C4.2677 4.2719 4.13958 4.4297 4.06472 4.61401C3.98986 4.79832 3.97167 5.00077 4.01248 5.19548C4.05328 5.39018 4.15122 5.56829 4.29379 5.70704L10.5868 12L4.29379 18.293C4.19781 18.3851 4.12119 18.4955 4.0684 18.6176C4.01562 18.7397 3.98773 18.8712 3.98638 19.0042C3.98503 19.1373 4.01023 19.2692 4.06052 19.3924C4.11081 19.5156 4.18517 19.6275 4.27925 19.7216C4.37333 19.8157 4.48523 19.89 4.60841 19.9403C4.73159 19.9906 4.86356 20.0158 4.9966 20.0144C5.12964 20.0131 5.26108 19.9852 5.38321 19.9324C5.50533 19.8796 5.6157 19.803 5.70785 19.707L12.0008 13.4141L18.2938 19.707C18.3859 19.803 18.4963 19.8796 18.6184 19.9324C18.7406 19.9852 18.872 20.0131 19.005 20.0145C19.1381 20.0158 19.27 19.9906 19.3932 19.9403C19.5164 19.89 19.6283 19.8157 19.7224 19.7216C19.8165 19.6275 19.8908 19.5156 19.9411 19.3924C19.9914 19.2692 20.0166 19.1373 20.0153 19.0042C20.0139 18.8712 19.986 18.7397 19.9332 18.6176C19.8804 18.4955 19.8038 18.3851 19.7078 18.293L13.4149 12L19.7078 5.70704C19.8523 5.56658 19.951 5.38574 19.991 5.18822C20.031 4.9907 20.0103 4.78571 19.9318 4.60013C19.8532 4.41454 19.7205 4.25701 19.5509 4.14818C19.3812 4.03935 19.1827 3.9843 18.9813 3.99024C18.7215 3.99798 18.4749 4.10656 18.2938 4.29298L12.0008 10.5859L5.70785 4.29298C5.61466 4.19718 5.50321 4.12104 5.3801 4.06904C5.25698 4.01704 5.1247 3.99025 4.99105 3.99024Z" fill="black"/>
                </svg>
            </div>
        </div>

        <cart-details v-if="sidebarState.currentView === 'cart'"
        ></cart-details>

        <address-form v-else-if="sidebarState.currentView === 'address'"
        ></address-form>

        <order-confirmation v-else-if="sidebarState.currentView === 'confirmation'"
        ></order-confirmation>

        <payment-order-confirmation v-else-if="sidebarState.currentView === 'payment-confirmation'"
        ></payment-order-confirmation>

        <auth-sidebar v-else-if="sidebarState.currentView === 'auth'"
        ></auth-sidebar>

        <favorites-sidebar v-else-if="erpCityUiConfig.showFavorites && sidebarState.currentView === 'favorites'"
        ></favorites-sidebar>

        <orders-sidebar v-else-if="erpCityUiConfig.showOrders && sidebarState.currentView === 'orders'"
        ></orders-sidebar>
    </div>
</template>
