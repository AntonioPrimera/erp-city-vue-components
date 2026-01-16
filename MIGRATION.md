# Migration Notes

## Extraction steps (from `prosys-lp`)

1. Copy Vue components from `prosys-lp/resources/js/components` into `erp-city-vue-components/src/components`.
2. Copy reactive state modules from `prosys-lp/resources/js/state` into `erp-city-vue-components/src/state`.
3. Copy shared composables from `prosys-lp/resources/js/composables` into `erp-city-vue-components/src/composables`.
4. Create `src/index.js` to export components/state/composables.
5. Add `package.json`, `.gitignore`, and `README.md` for package usage docs.

## Integration steps (in consuming app)

1. Add the package as a local dependency (e.g. `file:../erp-city-vue-components`).
2. Update imports to use `erp-city-vue-components` for state and shared components.
3. Ensure `vue`, `axios`, `ziggy-js` are installed and `route()` is available globally.
4. Register `v-input` globally in the app (required by the forms inside the sidebar).
