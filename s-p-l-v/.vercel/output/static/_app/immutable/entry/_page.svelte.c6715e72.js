import{S as J,i as K,s as L,k as u,a as P,q as _,l as f,m as p,h as i,c as j,r as v,n as c,p as M,b as A,E as s,F as q,u as N}from"../chunks/index.65606941.js";function O(b){let t,r;return{c(){t=u("h1"),r=_("Hello there."),this.h()},l(l){t=f(l,"H1",{class:!0});var e=p(t);r=v(e,"Hello there."),e.forEach(i),this.h()},h(){c(t,"class","mb-5 text-5xl font-bold")},m(l,e){A(l,t,e),s(t,r)},p:q,d(l){l&&i(t)}}}function Q(b){let t,r,l=b[0].user.username+"",e;return{c(){t=u("h1"),r=_("Hello "),e=_(l),this.h()},l(a){t=f(a,"H1",{class:!0});var n=p(t);r=v(n,"Hello "),e=v(n,l),n.forEach(i),this.h()},h(){c(t,"class","mb-5 text-5xl font-bold")},m(a,n){A(a,t,n),s(t,r),s(t,e)},p(a,n){n&1&&l!==(l=a[0].user.username+"")&&N(e,l)},d(a){a&&i(t)}}}function R(b){let t,r,l,e,a,n,k,S,D,d,H,y,I,T,g,V,C;function U(h,m){return h[0].user?Q:O}let w=U(b),o=w(b);return{c(){t=u("div"),r=u("div"),l=P(),e=u("div"),a=u("div"),o.c(),n=P(),k=u("p"),S=_("Thanks for stopping by."),D=P(),d=u("p"),H=_(`This is just a template. Start building your webpage with 
          `),y=u("a"),I=_("TailwindCSS"),T=_(" and "),g=u("a"),V=_("DaisyUI"),C=_("."),this.h()},l(h){t=f(h,"DIV",{class:!0,style:!0});var m=p(t);r=f(m,"DIV",{class:!0}),p(r).forEach(i),l=j(m),e=f(m,"DIV",{class:!0});var F=p(e);a=f(F,"DIV",{class:!0});var E=p(a);o.l(E),n=j(E),k=f(E,"P",{class:!0});var z=p(k);S=v(z,"Thanks for stopping by."),z.forEach(i),D=j(E),d=f(E,"P",{class:!0});var x=p(d);H=v(x,`This is just a template. Start building your webpage with 
          `),y=f(x,"A",{href:!0,class:!0});var B=p(y);I=v(B,"TailwindCSS"),B.forEach(i),T=v(x," and "),g=f(x,"A",{href:!0,class:!0});var G=p(g);V=v(G,"DaisyUI"),G.forEach(i),C=v(x,"."),x.forEach(i),E.forEach(i),F.forEach(i),m.forEach(i),this.h()},h(){c(r,"class","hero-overlay bg-opacity-60"),c(k,"class","mb-5"),c(y,"href","https://tailwindcss.com/docs/installation"),c(y,"class","link"),c(g,"href","https://daisyui.com/"),c(g,"class","link"),c(d,"class","mb-5"),c(a,"class","max-w-md"),c(e,"class","hero-content text-center text-neutral-content"),c(t,"class","hero min-h-screen"),M(t,"background-image","url(https://placeimg.com/640/480/tech)")},m(h,m){A(h,t,m),s(t,r),s(t,l),s(t,e),s(e,a),o.m(a,null),s(a,n),s(a,k),s(k,S),s(a,D),s(a,d),s(d,H),s(d,y),s(y,I),s(d,T),s(d,g),s(g,V),s(d,C)},p(h,[m]){w===(w=U(h))&&o?o.p(h,m):(o.d(1),o=w(h),o&&(o.c(),o.m(a,n)))},i:q,o:q,d(h){h&&i(t),o.d()}}}function W(b,t,r){let{data:l}=t;return b.$$set=e=>{"data"in e&&r(0,l=e.data)},[l]}class Y extends J{constructor(t){super(),K(this,t,W,R,L,{data:0})}}export{Y as default};
