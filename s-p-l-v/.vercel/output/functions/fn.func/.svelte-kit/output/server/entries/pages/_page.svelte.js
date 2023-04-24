import { c as create_ssr_component, e as escape } from "../../chunks/index3.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="hero min-h-screen" style="background-image: url(https://placeimg.com/640/480/tech);"><div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content"><div class="max-w-md">${data.user ? `<h1 class="mb-5 text-5xl font-bold">Hello ${escape(data.user.username)}</h1>` : `<h1 class="mb-5 text-5xl font-bold">Hello there.</h1>`}
        <p class="mb-5">Thanks for stopping by.</p>
        <p class="mb-5">This is just a template. Start building your webpage with 
          <a href="https://tailwindcss.com/docs/installation" class="link">TailwindCSS</a> and <a href="https://daisyui.com/" class="link">DaisyUI</a>.
        </p></div></div></div>`;
});
export {
  Page as default
};
