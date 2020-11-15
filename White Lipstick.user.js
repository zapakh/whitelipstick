// ==UserScript==
// @name         White Lipstick
// @namespace    https://twitch.tv/zapakh
// @version      0.2
// @description  Add single-character spans to Whitelips for fine-grained highlighting
// @author       Zapakh
// @match        https://vii5ard.github.io/whitespace/
// @grant        unsafeWindow
// ==/UserScript==

// Designed against Whitelips IDE ver 0.9.1

console.log("White Lipstick begins");

(function() {

/*
 * Whitespace 0.3 Cheat Sheet
 *
 * <num> is space or tab for sign, followed by one or more spaces or tabs, followed by linefeed.
 * For the instructions beginning with linefeed, <num> is actually a label.
 *
 * SS<num>  push <num>      Push <num> onto the stack
 * SLS      dup             Duplicate the top item of the stack
 * STS<num> copy <num>      Copy the <num>th item on the stack onto the top
 * SLT      swap            Exchange the top two items of the stack
 * SLL      drop            Discard the top item of the stack
 * STL<num> slide <num>     Slide <num> items off the stack, keeping the top item (?)
 *
 * TSSS     add             Add top number to second number
 * TSST     sub             Subtract top number minus second number
 * TSSL     mul             Multiply top number by second number
 * TSTS     div             Divide top number by second number (integer)
 * TSTT     mod             Reduce top number modulo second number
 *
 * TTS      store           Store a value to heap location at top of stack
 * TTT      retrieve        Retrieve the value from heap location at top of stack
 *
 * LSS<num> label <num>     Mark with the label
 * LST<num> call <num>      Call a subroutine
 * LSL<num> jmp <num>       Jump to label
 * LTS<num> jz <num>        Jump to label if zero
 * LTL      ret             Return to caller from a subroutine
 * LLL      end             End the program
 *
 * TLSS     printc          Output the character at the top of the stack
 * TLST     printi          Output the integer at the top of the stack
 * TLTS     readc           Read a character and store into a heap location
 * TLTT     readi           Read an integer and store into a heap location
 *
 */


// reInstruction was an early attempt.
// let reInstruction = /((  | \t | \t\n|\n  |\n \t|\n \n|\n\t )[\s\t][\s\t]+\n| \n | \n\t| \n\n|\t   |\t  \t|\t  \n|\t \t |\t \t\t|\t\t |\t\t\t|\n\t\n|\n\n\n|\t\n  |\t\n \t|\t\n\t |\t\n\t\t)/g;

// Separate regexes for different types of commands had problems with stepping on each other.
// let reNumCommand = /((  | \t | \t\n|\n  |\n \t|\n \n|\n\t )([ \t][ \t]+)\n)/g;
// let reNoNumCommand = /( \n | \n\t| \n\n|\t   |\t  \t|\t  \n|\t \t |\t \t\t|\t\t |\t\t\t|\n\t\n|\n\n\n|\t\n  |\t\n \t|\t\n\t |\t\n\t\t)/g;

// Holy mother of regex
// TODO: Tolerate non-whitespace chars in the editor, e.g., by injecting #* everywhere
let reCommand = /((  | \t | \t\n|\n  |\n \t|\n \n|\n\t )([ \t][ \t]+\n))|( \n | \n\t| \n\n|\t   |\t  \t|\t  \n|\t \t |\t \t\t|\t\t |\t\t\t|\n\t\n|\n\n\n|\t\n  |\t\n \t|\t\n\t |\t\n\t\t)/g;

/* Redefine the highlightSourceWs defined in ws_ide.js */
unsafeWindow.ws_ide.highlightSourceWs = function(src) {
      return src.replace(/[^\t\n ]/g, '#')
//              .replace(/([ ]+)/g, '<span class="spaces">\$1</span>')
                .replace(reCommand, (m, c1, cp, cn, c2) =>
                         (c1 ? ('b_commprm' + cp + 'b_number' + cn + 'e_spane_span')
                             : ('b_command' + c2 + 'e_span')))
//              .replace(/(\t\t)/g, 'b_command\$1e_command') // Working around some &gt; escaping here...
                .replace(/([ ]+)/g, (m, g1) => '<span class="spaces">'
                                              + g1.replace(/ /g, '<span class="space"> </span>')
                                              + '</span>')
                .replace(/(\t+)/g, '<span class="tabs">\$1</span>')
                .replace(/(\t)/g, '<span class="tab">\$1</span>')
                .replace(/b_number/g,'<span class="number">')
                .replace(/b_commprm/g,'<span class="command wparam">')
                .replace(/b_command/g,'<span class="command">')
                .replace(/e_span/g,'</span>')
                .replace(/#/g,' ');
};

unsafeWindow.$('#srcOverlay').html(unsafeWindow.ws_ide.highlightSourceWs(unsafeWindow.$('#srcInput').val()));
console.log(unsafeWindow.$('#srcOverlay').html());


// Edit this CSS and experiment.
// I can't get the :hover pseudo-class to work for the life of me.
// "outline" is close, but doesn't distinguish between instructions.
//      -Z:)

let styleText = `
/* Default color was #9999ff for tabs, #ff9999 for spaces.*/
.inputOverlay .tabs {
    background-color: transparent;
}

.inputOverlay .spaces {
    background-color: transparent;
}

.inputOverlay .tab {
    background-image: linear-gradient(to right, #99f, #ccf);
    opacity: 70%
}

.inputOverlay .space {
    background-image: linear-gradient(to right, #f99, #fcc);
    opacity: 70%
}

.inputOverlay .command {
/*  background-image: linear-gradient(to top right, #aaa, #fff);  */

    outline-style: solid;
    outline-color: #aaa;
    outline-width: 1px;

    border-right: 2px solid #000;

/*  box-shadow: inset 0px 0px 0px 1px #000; */

}

.inputOverlay .wparam {
    background-color: #888;
}

.inputOverlay .command .number {
    background-image: linear-gradient(to top, #888, #fff);
/*    background-color: #000; */
}

/*
.command:hover {
     background-color: #000;
}
*/
`
let head = document.getElementsByTagName('head')[0];
let style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = styleText;
head.appendChild(style);
})();
