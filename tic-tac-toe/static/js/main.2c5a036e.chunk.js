(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],[,,,,,,function(e,t,n){e.exports=n(16)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(3),c=n.n(o),i=n(1);n(11);function l(e){var t=e.starter,n=e.onNewGame,o=e.onStarterChange;Object(r.useEffect)((function(){console.log("toolbar changed")}));var c=function(e){var t=e.target.value,n="x"===t?"o":"x";document.getElementById("radio-"+t).classList.add("active"),document.getElementById("radio-"+n).classList.remove("active"),o(t)};return a.a.createElement("div",{className:"toolbar"},a.a.createElement("div",{className:"btn btn-primary toolbar-item text-button",onClick:n},"New Game"),a.a.createElement("div",{className:"toolbar-item"},"First:\xa0\xa0",a.a.createElement("div",{className:"btn-group btn-group-toggle","data-toggle":"buttons"},a.a.createElement("label",{id:"radio-x",className:"btn btn-primary active"},a.a.createElement("input",{type:"radio",name:"first",autoComplete:"off",value:"x",onChange:c,checked:"x"===t})," x"),a.a.createElement("label",{id:"radio-o",className:"btn btn-primary"},a.a.createElement("input",{type:"radio",name:"first",autoComplete:"off",value:"o",onChange:c,checked:"o"===t}),"o"))))}n(12);function u(e){var t=e.value,n=e.position,o=e.highlight,c=e.gameOver,l=e.next,u=e.onClick,s=Object(r.useState)(!1),m=Object(i.a)(s,2),f=m[0],b=m[1],g=f&&!c&&""===t;return a.a.createElement("div",{className:"tile",onMouseOver:function(){b(!0)},onMouseLeave:function(){b(!1)},onClick:function(){c||""!==t||(b(!1),u(n))},style:{backgroundColor:o?"yellow":"white"}},a.a.createElement("span",{style:{color:g?"rgba(0, 0, 0, 0.2)":"black"}},g?l:t))}n(13);function s(e){var t=e.game,n=e.onMovePlay,r=function(e){n(e)};return a.a.createElement("div",{className:"board"},t.grid.map((function(e,n){return a.a.createElement(u,{key:n,value:e,position:n,highlight:""!==t.winner&&t.tiles.indexOf(n)>=0,gameOver:""!==t.winner||t.full,next:t.current,onClick:r})})))}n(14);function m(e){return a.a.createElement("div",{className:"status"},""!==e.game.winner?"".concat(e.game.winner," wins the game!"):e.game.full?"Game over! It's a draw.":"It's ".concat(e.game.current,"'s turn."))}var f=n(4),b=n(5);function g(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}var p=function(e){return{grid:new Array(9).fill(""),current:e,empty:!0,full:!1,winner:"",tiles:[0,0,0]}},v=function(e,t){var n=Object(b.a)(e.grid);return n[t]=e.current,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?g(Object(n),!0).forEach((function(t){Object(f.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({grid:n,current:"x"===e.current?"o":"x",empty:!1,full:0===n.filter((function(e){return""===e})).length},d(n))},d=function(e){for(var t=0;t<2;t++){for(var n=["x","o"][t],r=0;r<9;r+=3)if(e[r+0]===n&&e[r+1]===n&&e[r+2]===n)return{winner:n,tiles:[r+0,r+1,r+2]};for(var a=0;a<3;a+=1)if(e[a+0]===n&&e[a+3]===n&&e[a+6]===n)return{winner:n,tiles:[a+0,a+3,a+6]};if(e[0]===n&&e[4]===n&&e[8]===n)return{winner:n,tiles:[0,4,8]};if(e[2]===n&&e[4]===n&&e[6]===n)return{winner:n,tiles:[2,4,6]}}return{winner:"",tiles:[0,0,0]}};n(15);c.a.render(a.a.createElement((function(){var e=Object(r.useState)("x"),t=Object(i.a)(e,2),n=t[0],o=t[1],c=Object(r.useState)(p(n)),u=Object(i.a)(c,2),f=u[0],b=u[1];return a.a.createElement("div",{className:"container"},a.a.createElement(l,{starter:n,onNewGame:function(){b(p(n))},onStarterChange:function(e){o(e),f.empty&&b(p(e))}}),a.a.createElement(s,{game:f,onMovePlay:function(e){b(v(f,e))}}),a.a.createElement(m,{game:f}))}),null),document.getElementById("root"))}],[[6,1,2]]]);
//# sourceMappingURL=main.2c5a036e.chunk.js.map