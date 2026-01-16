import {ref} from "vue";

export function useHandlesFormErrors() {
    let errorBag = ref({});
    let genericError = ref(null);

    //--- Methods -----------------------------------------------------------------------------------------------------

    function setErrorBag(error) {
        // Validation errors
        if (error.response.status === 422)
            errorBag.value = error.response.data.errors;

        genericError.value = error.response.data.message;
    }

    function emptyErrorBag() {
        errorBag.value = {};
    }

    function errorBagIsEmpty() {
        return !Object.keys(errorBag.value).length;
    }

    function error(fieldName) {
        if (fieldName === 'genericError')
            return genericError.value;

        return errorBag.value[fieldName] ? errorBag.value[fieldName][0] : '';
    }

    return {
        error,
        genericError,
        setErrorBag,
        emptyErrorBag,
        errorBagIsEmpty,
    }
}
