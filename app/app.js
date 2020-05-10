import Vue from 'nativescript-vue';

import Listly from './components/Listly';

// Uncommment the following to see NativeScript-Vue output logs
// Vue.config.silent = false;

new Vue({

    template: `
        <Frame>
            <Listly />
        </Frame>`,

    components: {
        Listly
    }
}).$start();