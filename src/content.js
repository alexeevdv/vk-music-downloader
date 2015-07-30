/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Dmitry V. Alexeev <mail@alexeevdv.ru>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var init = function(){

    function injectButton(){

        var divs = [].slice.call(document.querySelectorAll("div.audio"));

        divs.forEach(function(div){

            if (div.id === "audio_global") return;

            // if button is already added            
            if (div.querySelector('.audio_download')) return;

            var url = div.querySelector('input[type=hidden]').value;

            var filename = div.querySelector('.title_wrap b a').innerHTML;
            filename += " - ";
            filename += div.querySelector('.title_wrap .title').innerHTML;
            // trim
            filename = filename.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            // strip_tags
            filename = filename.replace(/<\/?[^>]+(>|$)/g, "");
            filename = filename.replace("&amp;", "&");
            filename = filename.replace(/[:\"\\\/]+/g, '_');            
            filename += ".mp3";

            console.log(filename);

            var wrapper = document.createElement('div');
            wrapper.innerHTML = "<div onmouseover=\"showTooltip(this, {text: '" + chrome.i18n.getMessage("Download") + "', showdt: 0, black: 1, shift: [9, 4, 0]});\" class='audio_download_wrap fl_r'><div class='audio_download'></div></div>";
            var button = wrapper.firstChild;

            div.querySelector(".actions").appendChild(button);

            button.addEventListener("click", function(event){
                event.preventDefault();
                event.stopPropagation();
                chrome.runtime.sendMessage({
                    extension: "vk-music-downloader",
                    action: "download",
                    url: url,
                    filename: filename
                });
                return false;
            });

            
        });

    };

    setInterval(injectButton, 3000);
    injectButton();
};

switch(document.readyState)
{
    case "interactive":
    case "complete":
        init();
        break;
    default:
        document.addEventListener("DOMContentLoaded", init);
        break;
}
