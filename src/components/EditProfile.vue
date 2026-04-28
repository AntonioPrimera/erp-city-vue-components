<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { authState } from '../state/authState.js';
import { sidebarState } from '../state/sidebarState.js';
import { useHandlesFormErrors } from '../composables/handlesFormErrors.js';
import { erpCityUiConfig } from '../config.js';

const { error, genericError, setErrorBag, emptyErrorBag } = useHandlesFormErrors();

const form = reactive({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    password: '',
    password_confirmation: '',
});

const isLoadingProfile = ref(false);
const isSaving = computed(() => authState.status === 'loading');
const showCompany = computed(() => erpCityUiConfig.showCompany);

function clearErrors() {
    emptyErrorBag();
    genericError.value = null;
}

function fillForm(user = {}) {
    form.name = user?.name ?? '';
    form.email = user?.email ?? '';
    form.phone = user?.phone ?? '';
    form.address = user?.address ?? '';
    form.company = user?.company ?? '';
    form.password = '';
    form.password_confirmation = '';
}

async function loadProfile() {
    if (! authState.isAuthenticated) {
        return;
    }

    isLoadingProfile.value = true;
    clearErrors();

    try {
        fillForm(authState.user ?? {});
        const profile = await authState.fetchProfile();
        fillForm(profile ?? authState.user ?? {});
    } catch (error) {
        setErrorBag(error);
    } finally {
        isLoadingProfile.value = false;
    }
}

async function onSubmit() {
    clearErrors();

    const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        address: form.address || null,
        company: form.company || null,
    };

    if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
    }

    try {
        await authState.updateProfile(payload);
        sidebarState.goBack();
    } catch (error) {
        setErrorBag(error);
    }
}

onMounted(() => {
    sidebarState.setHeader('Modifică datele contului', true);
    loadProfile();
});
</script>

<template>
    <div class="flex flex-col min-h-[calc(100vh-228px)]">
        <div v-if="isLoadingProfile" class="text-gray-500 text-sm mt-4">
            Se încarcă datele contului...
        </div>

        <form v-else @submit.prevent="onSubmit" class="flex flex-col flex-1">
            <div class="space-y-4">
                <v-input
                    id="edit_profile_name"
                    label="Nume complet"
                    placeholder="Nume complet"
                    :error="error('name')"
                    v-model="form.name"
                />

                <v-input
                    id="edit_profile_email"
                    label="Email"
                    placeholder="email@example.com"
                    type="email"
                    :error="error('email')"
                    v-model="form.email"
                />

                <v-input
                    id="edit_profile_phone"
                    label="Număr de telefon"
                    placeholder="Număr de telefon"
                    inputmode="tel"
                    :error="error('phone')"
                    v-model="form.phone"
                />

                <v-input
                    id="edit_profile_address"
                    label="Adresa"
                    placeholder="Adresa"
                    :error="error('address')"
                    v-model="form.address"
                />

                <v-input
                    v-if="showCompany"
                    id="edit_profile_company"
                    label="Societatea"
                    placeholder="Societatea"
                    :error="error('company')"
                    v-model="form.company"
                />

                <v-input
                    id="edit_profile_password"
                    label="Parolă nouă"
                    placeholder="Lasă gol pentru a păstra parola actuală"
                    type="password"
                    :error="error('password')"
                    v-model="form.password"
                />

                <v-input
                    id="edit_profile_password_confirmation"
                    label="Confirmă parola nouă"
                    placeholder="Confirmă parola nouă"
                    type="password"
                    :error="error('password_confirmation')"
                    v-model="form.password_confirmation"
                />
            </div>

            <div v-if="genericError" class="text-red-600 text-sm mt-4">
                {{ genericError }}
            </div>

            <button
                type="submit"
                class="btn btn-primary btn-full mt-8"
                :disabled="isSaving"
            >
                Salvează modificările
            </button>
        </form>
    </div>
</template>
