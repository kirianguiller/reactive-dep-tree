import Vue from "vue";
import vueCustomElement from "vue-custom-element";

import { lightStylesheet } from "dependencytreejs/lib";

Vue.config.productionTip = false;

Vue.use(vueCustomElement);

import ReactiveDepTree from "./ReactiveDepTree.vue";

// Configure Vue to ignore the element name when defined outside of Vue.
Vue.config.ignoredElements = ["reactive-dep-tree"];

// Enable the plugin

// Register your component
Vue.customElement("reactive-dep-tree", ReactiveDepTree, {
  // Additional Options: https://github.com/karol-f/vue-custom-element#options
  shadow: true,
  shadowCss: lightStylesheet,
  beforeCreateVueInstance(root) {
    const rootNode = root.el.getRootNode();

    if (rootNode instanceof ShadowRoot) {
      root.shadowRoot = rootNode;
    } else {
      root.shadowRoot = document.head;
    }
    return root;
  }
});
