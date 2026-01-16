# erp-city-vue-components

Shared Vue 3 components + reactive state used for ERP storefront flows (auth, cart, checkout, favorites, orders).
Designed to integrate with `erp-city` and `erp-city-client`:

- https://github.com/AntonioPrimera/erp-city
- https://github.com/AntonioPrimera/erp-city-client

## Install

Install from npm:

```bash
npm install erp-city-vue-components
```

Or add to your app `package.json`:

```json
{
  "dependencies": {
    "erp-city-vue-components": "^0.1.0"
  }
}
```

Then run:

```bash
npm install
```

## Requirements

- Vue 3
- Axios
- Ziggy JS (`ziggy-js`)
- A global `route()` helper (Ziggy) available at runtime
- A globally registered `v-input` component (used by forms in the sidebar)

## Usage

```js
import { createApp } from 'vue';
import {
  Sidebar,
  cartState,
  productsState,
  authState,
  favoritesState,
  sidebarState,
  setErpCityUiConfig,
} from 'erp-city-vue-components';

setErpCityUiConfig({
  showFavorites: false,
});

productsState.loadProducts();
cartState.loadCart();
authState.bootstrap();

const app = createApp({});
app.component('v-sidebar', Sidebar);
app.mount('#app');

// Example usage
sidebarState.open('cart');
```

## Exports

- Components: `Sidebar`, `CartButton`, `AuthButton`, `AuthSidebar`, `OrdersSidebar`, `FavoritesSidebar`, `CartDetails`, `AddressForm`, `OrderConfirmation`, `PaymentOrderConfirmation`, `ProductCard`, `FavoriteProductCard`, `QuantityInput`
- State: `authState`, `cartState`, `favoritesState`, `ordersState`, `productsState`, `sidebarState`
- Composables: `useHandlesFormErrors`
- Config: `setErpCityUiConfig`, `erpCityUiConfig`
