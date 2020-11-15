// ==UserScript==
// @name         White Lipstick
// @namespace    https://twitch.tv/zapakh
// @version      0.1
// @description  Add single-character spans to Whitelips for fine-grained highlighting
// @author       Zapakh
// @match        https://vii5ard.github.io/whitespace/
// @grant        unsafeWindow
// ==/UserScript==

// Designed against Whitelips IDE ver 0.9.1

console.log("White Lipstick begins");

(function() {

/* Redefine the highlightSourceWs defined in ws_ide.js */
unsafeWindow.ws_ide.highlightSourceWs = function(src) {
      return src.replace(/[^\t\n ]/g, '#')
//              .replace(/([ ]+)/g, '<span class="spaces">\$1</span>')
                .replace(/(([ ])+)/g, (m, g1, g2) => '<span class="spaces">'
                                                 + g1.replace(/ /g, '<span class="space"> </span>')
                                                 + '</span>')
                .replace(/(\t+)/g, '<span class="tabs">\$1</span>')
                .replace(/(\t)/g, '<span class="tab">\$1</span>')
                .replace(/#/g,' ');
};

unsafeWindow.$('#srcOverlay').html(unsafeWindow.ws_ide.highlightSourceWs(unsafeWindow.$('#srcInput').val()));
console.log(unsafeWindow.$('#srcOverlay').html());

let styleText = `
/* Default color was #9999ff for tabs, #ff9999 for spaces.*/
.inputOverlay .tabs {
}

.inputOverlay .spaces {
}

.inputOverlay .tab {
    background-image: linear-gradient(to right, #9999ff, #ccccff);
}

.inputOverlay .space {
    background-image: linear-gradient(to right, #ff9999, #ffcccc);
}
`
let head = document.getElementsByTagName('head')[0];
let style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = styleText;
head.appendChild(style);
})();
