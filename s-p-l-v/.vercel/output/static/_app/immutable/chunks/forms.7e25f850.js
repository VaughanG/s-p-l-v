import{p as g}from"./parse.1d2978b5.js";import{j as r}from"./singletons.6aa1f7af.js";r.disable_scroll_handling;r.goto;r.invalidate;const h=r.invalidateAll;r.preload_data;r.preload_code;const L=r.before_navigate;r.after_navigate;const _=r.apply_action;function A(e){const i=JSON.parse(e);return i.data&&(i.data=g(i.data)),i}function F(e,i=()=>{}){const l=async({action:a,result:n,reset:o})=>{n.type==="success"&&(o!==!1&&HTMLFormElement.prototype.reset.call(e),await h()),(location.origin+location.pathname===a.origin+a.pathname||n.type==="redirect"||n.type==="error")&&_(n)};async function s(a){var u,b,f;a.preventDefault();const n=new URL((u=a.submitter)!=null&&u.hasAttribute("formaction")?a.submitter.formAction:HTMLFormElement.prototype.cloneNode.call(e).action),o=new FormData(e),p=(b=a.submitter)==null?void 0:b.getAttribute("name");p&&o.append(p,((f=a.submitter)==null?void 0:f.getAttribute("value"))??"");const d=new AbortController;let m=!1;const y=await i({action:n,cancel:()=>m=!0,controller:d,data:o,form:e,submitter:a.submitter})??l;if(m)return;let c;try{const t=await fetch(n,{method:"POST",headers:{accept:"application/json","x-sveltekit-action":"true"},cache:"no-store",body:o,signal:d.signal});c=A(await t.text()),c.type==="error"&&(c.status=t.status)}catch(t){if((t==null?void 0:t.name)==="AbortError")return;c={type:"error",error:t}}y({action:n,data:o,form:e,update:t=>l({action:n,result:c,reset:t==null?void 0:t.reset}),result:c})}return HTMLFormElement.prototype.addEventListener.call(e,"submit",s),{destroy(){HTMLFormElement.prototype.removeEventListener.call(e,"submit",s)}}}export{_ as a,L as b,F as e,h as i};
