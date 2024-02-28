import Vue from "vue";
import {
  locale,
  Row,
  Col,
  Switch,
  Icon,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Poptip,
  Tabs,
  TabPane,
  Progress,
  Tooltip,
  Input,
  InputNumber,
  Modal,
  Spin,
  Circle,
  Collapse,
  Panel,
  DatePicker,
  CheckboxGroup,
  Checkbox,
  Page,
  Table,
  Select,
  Notice,
  Option,
  Card,
} from "view-design";
import "view-design/dist/styles/iview.css";
import lang from "view-design/dist/locale/en-US";
import wating from "@/components/transferStatus/wating";
import watingEnhance from "@/components/transferStatus/watingEnhance";
import wrong from "@/components/transferStatus/wrong";
import success from "@/components/transferStatus/success";
import thumbnail from "@/components/thumbnail";
import linkModal from "@/components/linkModal";

locale(lang);

//按需加载
Vue.component("Row", Row);
Vue.component("Col", Col);
Vue.component("i-switch", Switch);
Vue.component("Icon", Icon);
Vue.component("Dropdown", Dropdown);
Vue.component("DropdownMenu", DropdownMenu);
Vue.component("DropdownItem", DropdownItem);
Vue.component("Poptip", Poptip);
Vue.component("Tabs", Tabs);
Vue.component("TabPane", TabPane);
Vue.component("Progress", Progress);
Vue.component("Tooltip", Tooltip);
Vue.component("Input", Input);
Vue.component("InputNumber", InputNumber);
Vue.component("Modal", Modal);
Vue.component("Spin", Spin);
Vue.component("i-circle", Circle);
Vue.component("DatePicker", DatePicker);
Vue.component("CheckboxGroup", CheckboxGroup);
Vue.component("Checkbox", Checkbox);
Vue.component("Page", Page);
Vue.component("Select", Select);
Vue.component("Option", Option);

Vue.component("wating", wating);
Vue.component("watingEnhance", watingEnhance);
Vue.component("wrong", wrong);
Vue.component("success", success);

Vue.component("Collapse", Collapse);
Vue.component("Panel", Panel);
Vue.component("Table", Table);

Vue.component("thumbnail", thumbnail);
Vue.component("linkModal", linkModal);
Vue.component("Card", Card);

Vue.prototype.$Notice = Notice;

Vue.prototype.$Spin = Spin;
