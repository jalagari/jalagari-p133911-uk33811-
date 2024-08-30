/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function($) {
    "use strict";

    var dialogContentSelector = ".cmp-conversational__editor";
    var modeSelector = "coral-select[name='./mode']";
    var conversationalEndpoint = "input[name='./conversationalEndpoint']";
    var genaiEndpoint = "input[name='./genaiEndpoint']";

    $(document).on("dialog-loaded", function(e) {
        var $dialog = e.dialog;
        var $dialogContent = $dialog.find(dialogContentSelector);
        var dialogContent = $dialogContent.length > 0 ? $dialogContent[0] : undefined;

        if (dialogContent) {
            var modeElement = $dialogContent.find(modeSelector);
            var mode = modeElement ? modeElement.val() : undefined;
            showEndpointField(mode, $dialogContent);

            modeElement.on("change", function() {
                var mode = $(this).val();
                showEndpointField(mode, $dialogContent);
            })
        }
    });

    function showEndpointField(mode, $dialogContent) {
        if (mode === "conversational") {
            $dialogContent.find(conversationalEndpoint).closest(".coral-Form-fieldwrapper").show();
            $dialogContent.find(genaiEndpoint).closest(".coral-Form-fieldwrapper").hide();
        } else if (mode === "conversationalgenaisite") {
            $dialogContent.find(conversationalEndpoint).closest(".coral-Form-fieldwrapper").hide();
            $dialogContent.find(genaiEndpoint).closest(".coral-Form-fieldwrapper").show();
            $dialogContent.find(genaiEndpoint).val("https://1o6jfrasi1.execute-api.ap-south-1.amazonaws.com/proxy/adobe/formsgenai/identify-form");
        } else if (mode === "conversationalgenaiform") {
            $dialogContent.find(conversationalEndpoint).closest(".coral-Form-fieldwrapper").hide();
            $dialogContent.find(genaiEndpoint).closest(".coral-Form-fieldwrapper").show();
            $dialogContent.find(genaiEndpoint).val("https://1o6jfrasi1.execute-api.ap-south-1.amazonaws.com/proxy/adobe/formsgenai/conversational-form-filling");
        }
    }
})(jQuery);
