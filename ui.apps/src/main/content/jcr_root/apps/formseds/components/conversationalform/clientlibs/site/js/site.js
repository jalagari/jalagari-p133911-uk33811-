// Example of how a component should be initialized via JavaScript
// This script logs the value of the component's text property model message to the console

(function() {
    "use strict";

    // Best practice:
    // For a good separation of concerns, don't rely on the DOM structure or CSS selectors,
    // but use dedicated data attributes to identify all elements that the script needs to
    // interact with.
    var selectors = {
        self:      '[data-cmp-is="conversational"]'
    };

    function isForm() {
        const currentUrl = window.location.href;
        const parentUrl = window?.parent.location.href;
        return currentUrl?.includes("/content/forms/af") || parentUrl?.includes("/content/forms/af")
          || currentUrl?.includes("/content/dam/formsanddocuments") || parentUrl?.includes("/content/dam/formsanddocuments");
    }

    function isAuthoring() {
        const currentUrl = window.location.href;
        const parentUrl = window?.parent.location.href;
        return currentUrl?.includes("/editor.html") || parentUrl?.includes("/editor.html");
    }
    class ConversationalForm {

        static  NS = "cmp";
        static IS = "conversational";
        static bemBlock = 'cmp-conversational'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
        };
        constructor(config) {
            this.init(config);
        }

        async init(config) {
            config.element.removeAttribute("data-cmp-is");
            if (isAuthoring()) {
                return;
            }

            config.element.classList.add("cmp-conversational-hide");
            console.log("Conversational component Initialized");
            const dataset = config.element.dataset;
            const mode = dataset.mode || "conversational";
            let endpoint = dataset.conversationEndpoint || "https://283250-cfservice-stage.adobeio-static.net/api/v1/web/cf/messages" ;
            if(mode === "conversationalgenaisite" || mode === "conversationalgenaiform") {
                endpoint = dataset.genaiEndpoint;
            }
            const chatbotTitle =  dataset.chatbotTitle || "AEM Forms";
            const initialMessage = JSON.parse(dataset.initialMessages || '["Hello"]');

            const url = new URL(endpoint);
            const serverUrl = url.origin;

            const initProps = {
                basePath: serverUrl,
                apiPath: url.pathname,
                aemUrl: window.location.origin,
                chatbotTitle: chatbotTitle,
                mode: mode,
                initialMessage:  initialMessage.map(m => {
                    return {
                        sender: "server",
                        message: {
                            msg: m
                        }
                    }
                })
            }
            const staticAssetUrl = "https://283250-cfservice-stage.adobeio-static.net";
            const assetsManifestUrl = `${staticAssetUrl}/assets-manifest.json`;
            const response = await fetch(assetsManifestUrl);
            const manifest = await response.json();
            const indexJs = manifest['index.js'];
            const indexCss = manifest['index.css'];
            let cssLink = document.createElement('link')
            cssLink.href = `${staticAssetUrl}/${indexCss}`;
            cssLink.rel = 'stylesheet';
            document.head.appendChild(cssLink);


            let script = document.createElement('script');
            script.src = `${staticAssetUrl}/${indexJs}`;
            script.onload = function () {
                console.log("Conversational Form Loaded");
                let ChatBotEngine = window?.CF?.ChatbotEngine;
                let ChatbotRenderer = window?.CF?.ChatbotRenderer;
                if(ChatbotRenderer && ChatBotEngine) {
                    let chatbotengine = new ChatBotEngine(ChatbotRenderer, initProps);
                    chatbotengine.init();

                }
            };
            document.head.appendChild(script);
        }

    }

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new ConversationalForm({ element: elements[i] });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body             = document.querySelector("body");
        var observer         = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new ConversationalForm({ element: element });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (isForm() && ! isAuthoring()) {
        window.addEventListener('bridgeInitializeStart', (event) => {
            event.detail.guideBridge.connect(onDocumentReady);
        });
    } else {
        if (document.readyState !== "loading") {
            onDocumentReady();
        } else {
            document.addEventListener("DOMContentLoaded", onDocumentReady);
        }
    }
}());
