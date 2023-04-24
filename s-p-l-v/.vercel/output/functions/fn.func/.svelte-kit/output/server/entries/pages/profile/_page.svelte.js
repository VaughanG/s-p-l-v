import { c as create_ssr_component, e as escape } from "../../../chunks/index3.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="hero"><div class="hero-content flex-col lg:flex-row-reverse"><div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"><div class="card-body"><h2 class="card-title">Profile</h2>
		  <table><tr><td class="italic">Name:</td>
			  <td class="pl-2">${escape(data.user.name)}</td></tr>
			<tr><td class="italic">Email:</td>
			  <td class="pl-2">${escape(data.user.email)}</td></tr>
			<tr><td class="italic">Username:</td>
			  <td class="pl-2">${escape(data.user.username)}</td></tr></table></div></div></div></div>`;
});
export {
  Page as default
};
