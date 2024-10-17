import qrcode from 'qrcode-generator-es6';

export default (function (win, doc) {
    function getPrintableHTMLContent(str) {
        var htmlEl = doc.implementation.createHTMLDocument('Printable Document');
        htmlEl.body.innerHTML = str;
        return htmlEl.documentElement.outerHTML;
    }

    function makeQR(data, cellColor = '#223448') {
        const _qrcode = new qrcode(0, 'H');
        _qrcode.addData(data);
        _qrcode.make();
        return _qrcode.createSvgTag({
            margin: 5,
            cellSize: 4,
            cellColor: () => cellColor,
            obstruction: {
                // height: 10,
                // width: 10
                path: '/assets/images/san_jose_batangas_logo.jpg'
            }
        });
    }

    function printHTML(str) {
        /**
         * Create the blob of html page and setting its src to appended <iframe>
         **/
        var contentType = 'text/html;charset=utf-8';
        var fullHTMLStr = getPrintableHTMLContent(str);
        var contentBlob = new Blob([fullHTMLStr], { type: contentType });

        var frameEl = doc.createElement('iframe'),
            removeFrame = function () {
                if (frameEl) {
                    doc.body.removeChild(frameEl);
                    frameEl = null;
                }
            };
        frameEl.style.display = 'none';
        frameEl.onload = function () {
            try {
                this.contentWindow.print();
                setTimeout(function () {
                    // Timeout is used due to Firefox bug, when <iframe> is being removed before print occurs
                    removeFrame();
                }, 0);
            } catch (e) {
                console.log(e);
                this.alert(e.message);
            }
        };

        frameEl.src = URL.createObjectURL(contentBlob);
        doc.body.appendChild(frameEl);

        return frameEl.contentWindow;
    }

    return {
        print: printHTML,
        makeQR
    };
})(window, document);
