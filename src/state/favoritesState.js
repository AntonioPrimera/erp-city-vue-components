import { reactive } from 'vue';
import axios from 'axios';
import { route } from 'ziggy-js';

function normalizeFavoriteId(favorite) {
    if (typeof favorite === 'object' && favorite !== null) {
        return Number(favorite.id);
    }

    return Number(favorite);
}

export const favoritesState = reactive({
    ids: [],
    loading: false,
    error: null,

    isFavorite(productId) {
        return this.ids.includes(Number(productId));
    },

    setFavorites(favorites = []) {
        if (! Array.isArray(favorites)) {
            this.ids = [];
            return;
        }

        this.ids = favorites
            .map(normalizeFavoriteId)
            .filter(id => Number.isInteger(id) && id > 0);
    },

    reset() {
        this.ids = [];
        this.error = null;
        this.loading = false;
    },

    async fetchFavorites() {
        this.loading = true;
        this.error = null;

        try {
            const { data } = await axios.get(route('erp.account.favorites.index'));
            this.setFavorites(data.favorites);
        } catch (error) {
            if (error.response?.status === 401) {
                this.reset();
            } else {
                this.error = error.response?.data?.message || 'Nu am putut încărca favoritele.';
            }
        } finally {
            this.loading = false;
        }
    },

    toggleLocal(productId) {
        const id = Number(productId);

        if (! Number.isInteger(id) || id <= 0) {
            return;
        }

        if (this.ids.includes(id)) {
            this.ids = this.ids.filter(existingId => existingId !== id);
        } else {
            this.ids = [...this.ids, id];
        }
    },

    async toggle(productId) {
        if (! productId) {
            return;
        }

        this.loading = true;
        this.error = null;

        try {
            const { data } = await axios.post(route('erp.account.favorites.toggle', productId));

            if (Array.isArray(data?.favorites)) {
                this.setFavorites(data.favorites);
            } else {
                this.toggleLocal(productId);
            }
        } catch (error) {
            this.error = error.response?.data?.message || 'Nu am putut actualiza favoritele.';
            throw error;
        } finally {
            this.loading = false;
        }
    },
});
