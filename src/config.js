import { reactive } from 'vue';

export const erpCityUiConfig = reactive({
    showFavorites: true,
    showOrders: true,
    showCompany: true
});

export function setErpCityUiConfig(partial = {}) {
    Object.assign(erpCityUiConfig, partial);
}
