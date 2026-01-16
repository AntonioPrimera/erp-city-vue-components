import {reactive} from 'vue';

export const sidebarState = reactive({
    isOpen: false,
    currentView: null,
    title: '',
    withBack: false,
    viewStack: [],
    nextView: null,

    open(view) {
        this.currentView = view;

        if (this.currentView) {
            this.viewStack.push(this.currentView);
        }

        this.isOpen = true;
    },

    close() {
        this.isOpen = false;
        this.currentView = null;
        this.title = '';
        this.withBack = false;
        this.viewStack = [];
        this.nextView = null;
    },

    setHeader(title, withBack) {
        this.title = title;
        this.withBack = withBack;
    },

    goBack() {
        if (this.viewStack.length > 1) {
            // Remove current view
            this.viewStack.pop();
            // Set previous view (last in stack)
            this.currentView = this.viewStack[this.viewStack.length - 1];
        } else {
            this.close();
        }
    }
});
