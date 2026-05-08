import{c as o,j as s}from"./index-RzL-keDu.js";/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=o("Ghost",[["path",{d:"M9 10h.01",key:"qbtxuw"}],["path",{d:"M15 10h.01",key:"1qmjsl"}],["path",{d:"M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",key:"uwwb07"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=o("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]),r=e=>{const t=new Date(e);return t.setHours(0,0,0,0),t.getTime()},c=e=>{const t=new Date(e);return t.setHours(23,59,59,999),t.getTime()},u=e=>{const t=c(new Date),a=r(new Date),n=new Date(a);return n.setDate(n.getDate()-(e-1)),{start:n.getTime(),end:t}},m=e=>new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date(e)),f=e=>{const t=r(new Date),a=r(new Date(e)),n=(t-a)/(1e3*60*60*24);return n===0?"Hoje":n===1?"Ontem":n<7?new Intl.DateTimeFormat("pt-BR",{weekday:"long"}).format(new Date(e)):m(e)},x=e=>new Date(e).toISOString().split("T")[0],D=(e,t=!1)=>{const a=new Date(e+"T00:00:00");return t?c(a):r(a)},g=({title:e,description:t,icon:a="ghost"})=>s.jsxs("div",{className:"flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in zoom-in duration-500",children:[s.jsx("div",{className:"bg-secondary p-6 rounded-full text-muted-foreground mb-6",children:a==="search"?s.jsx(d,{size:48}):s.jsx(i,{size:48})}),s.jsx("h3",{className:"text-xl font-bold text-foreground mb-2",children:e}),s.jsx("p",{className:"text-muted-foreground max-w-[260px] text-sm leading-relaxed",children:t})]});export{g as E,D as a,r as b,c,f,u as g,x as t};
