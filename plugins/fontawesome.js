import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTwitterSquare,
  faDiscord,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Add icons to the library
library.add(faTwitterSquare, faDiscord, faMedium, faBars, faTimes);
// Register FontAwesomeIcon component globally
Vue.component("font-awesome-icon", FontAwesomeIcon);
