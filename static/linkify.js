"use strict";

var linkifyElement = require('linkifyjs/element');

var messages = document.querySelector('table.feed');

var observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        var newNode = mutation.addedNodes;
        linkifyElement(newNode[0]);
    });
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};

observer.observe(messages, config);
