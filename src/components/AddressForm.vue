<script setup>
import axios from "axios";
import { sidebarState } from "../state/sidebarState.js";
import { cartState } from "../state/cartState.js";
import { authState } from "../state/authState.js";
import { useHandlesFormErrors } from "../composables/handlesFormErrors.js";
import { onMounted, computed, reactive, ref, watch } from "vue";
import { erpCityUiConfig } from "../config.js";

const {error, setErrorBag} = useHandlesFormErrors();

const addressData = reactive({
    name: null,
    address: null,
    phone: null,
    email: null,
    company: null
})

let loading = ref(false);
const cardPaymentsEnabled = ref(true);
const paymentType = ref(cardPaymentsEnabled.value ? 'card' : 'on_delivery');
const paymentMethodsLoaded = ref(false);
const hasPrefilledFromProfile = ref(false);
const isPrefillingProfile = ref(false);
const profileFieldMap = {
    name: "name",
    email: "email",
    phone: "phone",
    address: "address",
    company: "company",
};
const showCompany = computed(() => erpCityUiConfig.showCompany);

watch(addressData, (newData) => {
    localStorage.setItem('addressData', JSON.stringify(newData));
}, { deep: true });

const isMissingAddressField = (value) => value === null || value === undefined || value === '';

async function prefillAddressFromProfile() {
    if (!authState.isAuthenticated || hasPrefilledFromProfile.value || isPrefillingProfile.value) {
        return;
    }

    isPrefillingProfile.value = true;

    try {
        const { data } = await axios.get(route('erp.auth.me'));
        const profile = data?.data;

        if (!profile) {
            return;
        }

        Object.entries(profileFieldMap).forEach(([profileKey, addressKey]) => {
            const profileValue = profile[profileKey];

            if (profileValue && isMissingAddressField(addressData[addressKey])) {
                addressData[addressKey] = profileValue;
            }
        });

        hasPrefilledFromProfile.value = true;
    } catch (error) {
        console.warn('Failed to prefill address data from ERP profile', error);
    } finally {
        isPrefillingProfile.value = false;
    }
}

function confirmOrder() {
    loading.value = true;

    axios.post(route('erp.orders.store'), {
        ...addressData,
        items: cartState.items,
        payment_type: cartState.price ? paymentType.value : null,
        coupon_code: cartState.coupon?.code ?? null,
    })
        .then((response) => {
            const checkoutUrl = response?.data?.checkout_url;
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
                return;
            }

            if (cartState.price) {
                sidebarState.open('payment-confirmation');
            } else {
                sidebarState.open('confirmation');
            }
            cartState.clearCart();
            localStorage.removeItem('addressData');
        })
        .catch(error => {
            setErrorBag(error);
            console.error("Error saving order:", error);
        })
        .finally(() => {
            loading.value = false;
        });
}

onMounted(() => {
    const savedAddress = localStorage.getItem('addressData');

    if (savedAddress) {
        Object.assign(addressData, JSON.parse(savedAddress));
    }

    if (authState.isAuthenticated) {
        prefillAddressFromProfile();
    }

    sidebarState.setHeader('Adresa', true);
    loadPaymentMethods();
});

watch(
    () => authState.isAuthenticated,
    (isAuthenticated) => {
        if (isAuthenticated) {
            prefillAddressFromProfile();
        } else {
            hasPrefilledFromProfile.value = false;
        }
    }
);

async function loadPaymentMethods() {
    try {
        const { data } = await axios.get(route('erp.paymentMethods'));
        const cardEnabled = data?.data?.card_enabled;
        if (typeof cardEnabled === 'boolean') {
            cardPaymentsEnabled.value = cardEnabled;
        }
    } catch (error) {
        console.warn('Failed to load ERP payment methods', error);
    } finally {
        if (!cardPaymentsEnabled.value) {
            paymentType.value = 'on_delivery';
        }
        paymentMethodsLoaded.value = true;
    }
}
</script>

<template>
    <div class="grid grid-cols-1 gap-4 lg:gap-4">
        <v-input class="col-span-full"
                 id="name"
                 label="Nume și prenume"
                 placeholder="Nume și prenume"
                 :error="error('name')"
                 autofocus
                 v-model="addressData.name"
        ></v-input>

        <v-input v-if="showCompany"
                 id="company"
                 label="Societatea"
                 placeholder="Societatea"
                 :error="error('company')"
                 v-model="addressData.company"
        ></v-input>

        <v-input id="address"
                 label="Adresa"
                 placeholder="Adresa"
                 :error="error('address')"
                 v-model="addressData.address"
        ></v-input>

        <v-input id="phone"
                 label="Număr de telefon"
                 placeholder="Număr de telefon"
                 inputmode="tel"
                 :error="error('phone')"
                 v-model="addressData.phone"
        ></v-input>

        <v-input id="email"
                 label="Email"
                 placeholder="Email"
                 inputmode="email"
                 :error="error('email')"
                 v-model="addressData.email"
        ></v-input>
    </div>

    <div v-if="cartState.price && paymentMethodsLoaded" class="mt-8">
        <div class="font-medium text-lg lg:text-xl mb-4">Selectează metoda de plată</div>

        <div class="space-y-4 lg:space-y-6">
            <div
                v-if="cardPaymentsEnabled"
                class="border border-primary p-7 rounded-xl flex items-center cursor-pointer"
                :class="{ 'bg-primary/5': paymentType === 'card' }"
                @click="paymentType = 'card'"
            >
                <div class="mr-5.5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="11.25" fill="white" stroke="#2F5233" stroke-width="1.5"/>
                        <circle
                            cx="12.0007"
                            cy="12"
                            r="6.66667"
                            :fill="paymentType === 'card' ? '#2F5233' : 'white'"
                            :stroke="paymentType === 'card' ? '#2F5233' : 'white'"
                        />
                    </svg>
                </div>
                <div class="font-medium text-lg lg:text-xl">Card</div>
            </div>

            <div
                class="border border-primary p-7 rounded-xl flex items-center cursor-pointer"
                :class="{ 'bg-primary/5': paymentType === 'on_delivery' }"
                @click="paymentType = 'on_delivery'"
            >
                <div class="mr-5.5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="11.25" fill="white" stroke="#2F5233" stroke-width="1.5"/>
                        <circle
                            cx="12.0007"
                            cy="12"
                            r="6.66667"
                            :fill="paymentType === 'on_delivery' ? '#2F5233' : 'white'"
                            :stroke="paymentType === 'on_delivery' ? '#2F5233' : 'white'"
                        />
                    </svg>
                </div>
                <div class="font-medium text-lg lg:text-xl">Ramburs</div>
            </div>
        </div>
    </div>

    <button type="button"
            class="btn btn-primary btn-full mt-6"
            @click="confirmOrder"
    >
        {{
            cartState.price
                ? (cardPaymentsEnabled && paymentType === 'card' ? 'Continuă spre plată' : 'Finalizează')
                : 'Trimite solicitare'
        }}
    </button>
</template>
