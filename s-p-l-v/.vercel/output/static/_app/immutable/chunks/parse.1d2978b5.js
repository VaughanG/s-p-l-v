const b={"<":"\\u003C",">":"\\u003E","/":"\\u002F","\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","	":"\\t","\0":"\\u0000","\u2028":"\\u2028","\u2029":"\\u2029"};class A extends Error{constructor(o,c){super(o),this.name="DevalueError",this.path=c.join("")}}function _(n){return Object(n)!==n}const g=Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function k(n){const o=Object.getPrototypeOf(n);return o===Object.prototype||o===null||Object.getOwnPropertyNames(o).sort().join("\0")===g}function S(n){return Object.prototype.toString.call(n).slice(8,-1)}function m(n){let o='"';for(let c=0;c<n.length;c+=1){const r=n.charAt(c),s=r.charCodeAt(0);if(r==='"')o+='\\"';else if(r in b)o+=b[r];else if(s<=31)o+=`\\u${s.toString(16).toUpperCase().padStart(4,"0")}`;else if(s>=55296&&s<=57343){const e=n.charCodeAt(c+1);s<=56319&&e>=56320&&e<=57343?o+=r+n[++c]:o+=`\\u${s.toString(16).toUpperCase()}`}else o+=r}return o+='"',o}const h=-1,j=-2,E=-3,I=-4,O=-5,N=-6;function D(n,o){return w(JSON.parse(n),o)}function w(n,o){if(typeof n=="number")return s(n,!0);if(!Array.isArray(n)||n.length===0)throw new Error("Invalid input");const c=n,r=Array(c.length);function s(e,y=!1){if(e===h)return;if(e===E)return NaN;if(e===I)return 1/0;if(e===O)return-1/0;if(e===N)return-0;if(y)throw new Error("Invalid input");if(e in r)return r[e];const t=c[e];if(!t||typeof t!="object")r[e]=t;else if(Array.isArray(t))if(typeof t[0]=="string"){const u=t[0],f=o==null?void 0:o[u];if(f)return r[e]=f(s(t[1]));switch(u){case"Date":r[e]=new Date(t[1]);break;case"Set":const i=new Set;r[e]=i;for(let a=1;a<t.length;a+=1)i.add(s(t[a]));break;case"Map":const l=new Map;r[e]=l;for(let a=1;a<t.length;a+=2)l.set(s(t[a]),s(t[a+1]));break;case"RegExp":r[e]=new RegExp(t[1],t[2]);break;case"Object":r[e]=Object(t[1]);break;case"BigInt":r[e]=BigInt(t[1]);break;case"null":const p=Object.create(null);r[e]=p;for(let a=1;a<t.length;a+=2)p[t[a]]=s(t[a+1]);break;default:throw new Error(`Unknown type ${u}`)}}else{const u=new Array(t.length);r[e]=u;for(let f=0;f<t.length;f+=1){const i=t[f];i!==j&&(u[f]=s(i))}}else{const u={};r[e]=u;for(const f in t){const i=t[f];u[f]=s(i)}}return r[e]}return s(0)}export{A as D,j as H,E as N,I as P,h as U,O as a,N as b,k as c,S as g,_ as i,D as p,m as s,w as u};