import { c as create_ssr_component, a as add_attribute, e as escape, g as get_store_value, b as compute_slots, v as validate_component } from "../../chunks/index3.js";
import { w as writable } from "../../chunks/index2.js";
const themeSkeleton = "";
const all = "";
const app = "";
const siteTitle = "Prisma-Lucia-Sveltekit";
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<header><div class="relative flex items-center justify-between pb-4"><a href="/" aria-label="Company"${add_attribute("title", siteTitle, 0)} class="inline-flex items-center"><svg class="w-8 text-deep-purple-accent-400" viewBox="0 0 24 24" stroke-linejoin="round" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" stroke="currentColor" fill="none"><rect x="3" y="1" width="7" height="12"></rect><rect x="3" y="17" width="7" height="6"></rect><rect x="14" y="1" width="7" height="6"></rect><rect x="14" y="11" width="7" height="12"></rect></svg>
      <span class="ml-2 text-xl font-bold tracking-wide text-gray-800 dark:text-gray-300 uppercase">${escape(siteTitle)}</span></a></div></header>`;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `
<footer><div class="flex flex-col-reverse justify-between pt-5 pb-10lg:flex-row"><p class="text-sm text-gray-600 dark:text-gray-400 text-center">© Copyright 2023 David. All rights reserved.
    </p></div></footer>`;
});
const stores = {};
function getStorage(type) {
  return type === "local" ? localStorage : sessionStorage;
}
function localStorageStore(key, initialValue, options) {
  const serializer = options?.serializer ?? JSON;
  const storageType = options?.storage ?? "local";
  const browser = typeof window !== "undefined" && typeof document !== "undefined";
  function updateStorage(key2, value) {
    if (!browser)
      return;
    getStorage(storageType).setItem(key2, serializer.stringify(value));
  }
  if (!stores[key]) {
    const store = writable(initialValue, (set2) => {
      const json = browser ? getStorage(storageType).getItem(key) : null;
      if (json) {
        set2(serializer.parse(json));
      }
      if (browser) {
        const handleStorage = (event) => {
          if (event.key === key)
            set2(event.newValue ? serializer.parse(event.newValue) : null);
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
      }
    });
    const { subscribe, set } = store;
    stores[key] = {
      set(value) {
        updateStorage(key, value);
        set(value);
      },
      update(updater) {
        const value = updater(get_store_value(store));
        updateStorage(key, value);
        set(value);
      },
      subscribe
    };
  }
  return stores[key];
}
localStorageStore("modeOsPrefers", false);
localStorageStore("modeUserPrefers", void 0);
localStorageStore("modeCurrent", false);
const cBase = "flex flex-col";
const cRowMain = "grid items-center";
const cRowHeadline = "";
const cSlotLead = "flex-none flex justify-between items-center";
const cSlotDefault = "flex-auto";
const cSlotTrail = "flex-none flex items-center space-x-4";
const AppBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let classesRowMain;
  let classesRowHeadline;
  let classesSlotLead;
  let classesSlotDefault;
  let classesSlotTrail;
  let $$slots = compute_slots(slots);
  let { background = "bg-surface-100-800-token" } = $$props;
  let { border = "" } = $$props;
  let { padding = "p-4" } = $$props;
  let { shadow = "" } = $$props;
  let { spacing = "space-y-4" } = $$props;
  let { gridColumns = "grid-cols-[auto_1fr_auto]" } = $$props;
  let { gap = "gap-4" } = $$props;
  let { regionRowMain = "" } = $$props;
  let { regionRowHeadline = "" } = $$props;
  let { slotLead = "" } = $$props;
  let { slotDefault = "" } = $$props;
  let { slotTrail = "" } = $$props;
  let { label = "" } = $$props;
  let { labelledby = "" } = $$props;
  if ($$props.background === void 0 && $$bindings.background && background !== void 0)
    $$bindings.background(background);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  if ($$props.shadow === void 0 && $$bindings.shadow && shadow !== void 0)
    $$bindings.shadow(shadow);
  if ($$props.spacing === void 0 && $$bindings.spacing && spacing !== void 0)
    $$bindings.spacing(spacing);
  if ($$props.gridColumns === void 0 && $$bindings.gridColumns && gridColumns !== void 0)
    $$bindings.gridColumns(gridColumns);
  if ($$props.gap === void 0 && $$bindings.gap && gap !== void 0)
    $$bindings.gap(gap);
  if ($$props.regionRowMain === void 0 && $$bindings.regionRowMain && regionRowMain !== void 0)
    $$bindings.regionRowMain(regionRowMain);
  if ($$props.regionRowHeadline === void 0 && $$bindings.regionRowHeadline && regionRowHeadline !== void 0)
    $$bindings.regionRowHeadline(regionRowHeadline);
  if ($$props.slotLead === void 0 && $$bindings.slotLead && slotLead !== void 0)
    $$bindings.slotLead(slotLead);
  if ($$props.slotDefault === void 0 && $$bindings.slotDefault && slotDefault !== void 0)
    $$bindings.slotDefault(slotDefault);
  if ($$props.slotTrail === void 0 && $$bindings.slotTrail && slotTrail !== void 0)
    $$bindings.slotTrail(slotTrail);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.labelledby === void 0 && $$bindings.labelledby && labelledby !== void 0)
    $$bindings.labelledby(labelledby);
  classesBase = `${cBase} ${background} ${border} ${spacing} ${padding} ${shadow} ${$$props.class ?? ""}`;
  classesRowMain = `${cRowMain} ${gridColumns} ${gap} ${regionRowMain}`;
  classesRowHeadline = `${cRowHeadline} ${regionRowHeadline}`;
  classesSlotLead = `${cSlotLead} ${slotLead}`;
  classesSlotDefault = `${cSlotDefault} ${slotDefault}`;
  classesSlotTrail = `${cSlotTrail} ${slotTrail}`;
  return `<div class="${"app-bar " + escape(classesBase, true)}" data-testid="app-bar" role="toolbar"${add_attribute("aria-label", label, 0)}${add_attribute("aria-labelledby", labelledby, 0)}>
	<div class="${"app-bar-row-main " + escape(classesRowMain, true)}">
		${$$slots.lead ? `<div class="${"app-bar-slot-lead " + escape(classesSlotLead, true)}">${slots.lead ? slots.lead({}) : ``}</div>` : ``}
		
		<div class="${"app-bar-slot-default " + escape(classesSlotDefault, true)}">${slots.default ? slots.default({}) : ``}</div>
		
		${$$slots.trail ? `<div class="${"app-bar-slot-trail " + escape(classesSlotTrail, true)}">${slots.trail ? slots.trail({}) : ``}</div>` : ``}</div>
	
	${$$slots.headline ? `<div class="${"app-bar-row-headline " + escape(classesRowHeadline, true)}">${slots.headline ? slots.headline({}) : ``}</div>` : ``}</div>`;
});
const cBaseAppShell = "w-full h-full flex flex-col overflow-hidden";
const cContentArea = "w-full h-full flex overflow-hidden";
const cPage = "flex-1 overflow-x-hidden flex flex-col";
const cSidebarLeft = "flex-none overflow-x-hidden overflow-y-auto";
const cSidebarRight = "flex-none overflow-x-hidden overflow-y-auto";
const AppShell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let classesheader;
  let classesSidebarLeft;
  let classesSidebarRight;
  let classesPageHeader;
  let classesPageContent;
  let classesPageFooter;
  let classesFooter;
  let $$slots = compute_slots(slots);
  let { regionPage = "" } = $$props;
  let { slotHeader = "z-10" } = $$props;
  let { slotSidebarLeft = "w-auto" } = $$props;
  let { slotSidebarRight = "w-auto" } = $$props;
  let { slotPageHeader = "" } = $$props;
  let { slotPageContent = "" } = $$props;
  let { slotPageFooter = "" } = $$props;
  let { slotFooter = "" } = $$props;
  if ($$props.regionPage === void 0 && $$bindings.regionPage && regionPage !== void 0)
    $$bindings.regionPage(regionPage);
  if ($$props.slotHeader === void 0 && $$bindings.slotHeader && slotHeader !== void 0)
    $$bindings.slotHeader(slotHeader);
  if ($$props.slotSidebarLeft === void 0 && $$bindings.slotSidebarLeft && slotSidebarLeft !== void 0)
    $$bindings.slotSidebarLeft(slotSidebarLeft);
  if ($$props.slotSidebarRight === void 0 && $$bindings.slotSidebarRight && slotSidebarRight !== void 0)
    $$bindings.slotSidebarRight(slotSidebarRight);
  if ($$props.slotPageHeader === void 0 && $$bindings.slotPageHeader && slotPageHeader !== void 0)
    $$bindings.slotPageHeader(slotPageHeader);
  if ($$props.slotPageContent === void 0 && $$bindings.slotPageContent && slotPageContent !== void 0)
    $$bindings.slotPageContent(slotPageContent);
  if ($$props.slotPageFooter === void 0 && $$bindings.slotPageFooter && slotPageFooter !== void 0)
    $$bindings.slotPageFooter(slotPageFooter);
  if ($$props.slotFooter === void 0 && $$bindings.slotFooter && slotFooter !== void 0)
    $$bindings.slotFooter(slotFooter);
  classesBase = `${cBaseAppShell} ${$$props.class ?? ""}`;
  classesheader = `${slotHeader}`;
  classesSidebarLeft = `${cSidebarLeft} ${slotSidebarLeft}`;
  classesSidebarRight = `${cSidebarRight} ${slotSidebarRight}`;
  classesPageHeader = `${slotPageHeader}`;
  classesPageContent = `${slotPageContent}`;
  classesPageFooter = `${slotPageFooter}`;
  classesFooter = `${slotFooter}`;
  return `<div id="appShell"${add_attribute("class", classesBase, 0)} data-testid="app-shell">
	${$$slots.header ? `<header id="shell-header" class="${"flex-none " + escape(classesheader, true)}">${slots.header ? slots.header({}) : ``}</header>` : ``}

	
	<div class="${"flex-auto " + escape(cContentArea, true)}">
		${$$slots.sidebarLeft ? `<aside id="sidebar-left"${add_attribute("class", classesSidebarLeft, 0)}>${slots.sidebarLeft ? slots.sidebarLeft({}) : ``}</aside>` : ``}

		
		<div id="page" class="${escape(regionPage, true) + " " + escape(cPage, true)}">
			${$$slots.pageHeader ? `<header id="page-header" class="${"flex-none " + escape(classesPageHeader, true)}">${slots.pageHeader ? slots.pageHeader({}) : `(slot:header)`}</header>` : ``}

			
			<main id="page-content" class="${"flex-auto " + escape(classesPageContent, true)}">${slots.default ? slots.default({}) : ``}</main>

			
			${$$slots.pageFooter ? `<footer id="page-footer" class="${"flex-none " + escape(classesPageFooter, true)}">${slots.pageFooter ? slots.pageFooter({}) : `(slot:footer)`}</footer>` : ``}</div>

		
		${$$slots.sidebarRight ? `<aside id="sidebar-right"${add_attribute("class", classesSidebarRight, 0)}>${slots.sidebarRight ? slots.sidebarRight({}) : ``}</aside>` : ``}</div>

	
	${$$slots.footer ? `<footer id="shell-footer" class="${"flex-none " + escape(classesFooter, true)}">${slots.footer ? slots.footer({}) : ``}</footer>` : ``}</div>`;
});
const ProgressBar_svelte_svelte_type_style_lang = "";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-1lfsqsa_START -->${$$result.title = `<title>${escape(siteTitle)}</title>`, ""}<!-- HEAD_svelte-1lfsqsa_END -->`, ""}
${validate_component(AppShell, "AppShell").$$render($$result, {}, {}, {
    header: () => {
      return `${validate_component(AppBar, "AppBar").$$render($$result, {}, {}, {
        trail: () => {
          return `${!data.user ? `<a href="/login" class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline">Sign in</a>
        <a href="/signup" class="ml-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline">Sign up</a>` : `<a href="/profile" class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline">${escape(data.user.username)}</a>
        <a href="/logout" class="ml-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline">Sign out</a>`}
	    `;
        },
        lead: () => {
          return `${validate_component(Header, "Header").$$render($$result, {}, {}, {})}`;
        }
      })}
    `;
    },
    default: () => {
      return `<main id="main" class="justify-center flex flex-auto">${slots.default ? slots.default({}) : ``}</main>
		 
		${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
    }
  })}`;
});
export {
  Layout as default
};
