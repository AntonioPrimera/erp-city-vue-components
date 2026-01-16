import { reactive } from 'vue';
import axios from 'axios';
import { route } from 'ziggy-js';
import { favoritesState } from './favoritesState.js';
import { ordersState } from './ordersState.js';
import { erpCityUiConfig } from '../config.js';

const STORAGE_KEY = 'erp_auth';
const hasStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function normalizeAuthPayload(payload = {}) {
    return {
        user: payload.user ?? null,
        token: payload.token ?? null,
        token_type: payload.token_type ?? payload.tokenType ?? null,
        expires_at: payload.expires_at ?? payload.expiresAt ?? null,
    };
}

function readStoredAuth() {
    if (! hasStorage) {
        return null;
    }

    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        return value ? normalizeAuthPayload(JSON.parse(value)) : null;
    } catch (e) {
        console.warn('Failed to parse stored ERP auth', e);
        return null;
    }
}

function persistAuth(auth) {
    if (! hasStorage) {
        return;
    }

    if (! auth || ! auth.token) {
        window.localStorage.removeItem(STORAGE_KEY);
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

function applyAuthHeader(token, tokenType = 'Bearer') {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `${tokenType ?? 'Bearer'} ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
}

function isTokenExpired(expiresAt) {
    if (! expiresAt) {
        return false;
    }

    const expires = new Date(expiresAt);

    return Number.isNaN(expires.getTime()) ? false : expires.getTime() <= Date.now();
}

const storedAuth = readStoredAuth();

if (storedAuth?.token) {
    applyAuthHeader(storedAuth.token, storedAuth.token_type);
}

export const authState = reactive({
    user: storedAuth?.user ?? null,
    token: storedAuth?.token ?? null,
    tokenType: storedAuth?.token_type ?? null,
    expiresAt: storedAuth?.expires_at ?? null,
    status: 'idle',
    error: null,

    get isAuthenticated() {
        return Boolean(this.user && this.token && ! this.tokenExpired());
    },

    tokenExpired() {
        if (isTokenExpired(this.expiresAt)) {
            this.clearAuth();

            return true;
        }

        return false;
    },

    setAuth(payload) {
        const auth = normalizeAuthPayload(payload);

        if (! auth.token || ! auth.user || isTokenExpired(auth.expires_at)) {
            this.clearAuth();
            return;
        }

        auth.token_type = auth.token_type ?? 'Bearer';

        this.user = auth.user;
        this.token = auth.token;
        this.tokenType = auth.token_type;
        this.expiresAt = auth.expires_at;
        this.error = null;

        persistAuth(auth);
        applyAuthHeader(this.token, this.tokenType);

        if (erpCityUiConfig.showFavorites) {
            favoritesState.fetchFavorites();
        }
        if (erpCityUiConfig.showOrders) {
            ordersState.fetchOrders();
        }
    },

    clearAuth() {
        this.user = null;
        this.token = null;
        this.tokenType = null;
        this.expiresAt = null;
        this.error = null;

        persistAuth(null);
        applyAuthHeader(null);
        favoritesState.reset();
        ordersState.reset();
    },

    async bootstrap() {
        try {
            const { data } = await axios.get(route('erp.auth.session'));

            if (data.authenticated && data.token && data.user) {
                this.setAuth(data);
            } else {
                this.clearAuth();
            }
        } catch (e) {
            console.warn('Failed to bootstrap ERP auth', e);
            this.clearAuth();
        }
    },

    async login(payload) {
        this.status = 'loading';
        this.error = null;

        try {
            const { data } = await axios.post(route('erp.auth.login'), payload);
            this.setAuth(data);
        } catch (error) {
            this.error = error.response?.data?.message || 'Autentificarea a eșuat.';
            this.clearAuth();
            throw error;
        } finally {
            this.status = 'idle';
        }
    },

    async register(payload) {
        this.status = 'loading';
        this.error = null;

        try {
            const { data } = await axios.post(route('erp.auth.register'), payload);
            this.setAuth(data);
        } catch (error) {
            this.error = error.response?.data?.message || 'Înregistrarea a eșuat.';
            this.clearAuth();
            throw error;
        } finally {
            this.status = 'idle';
        }
    },

    async logout() {
        this.status = 'loading';
        try {
            await axios.post(route('erp.auth.logout'));
        } finally {
            this.status = 'idle';
            this.clearAuth();
        }
    },
});
