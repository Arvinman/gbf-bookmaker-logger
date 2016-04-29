document.addEventListener('DOMContentLoaded', function () {

    function bookmakerToCvs(bookmaker) {
        var str = '';
        for (var i = 0; i < bookmaker.length; i++) {
            var record = bookmaker[i];
            str += record.time
            + ',' + record.n
            + ',' + record.w
            + ',' + record.e
            + ',' + record.s;
            str += '\r\n';
        }
        return str;
    }

    document.getElementById('save').addEventListener('click', function () {
        chrome.storage.local.get('bookmaker', function (obj) {
            console.log(obj);

            if (!obj.hasOwnProperty('bookmaker'))
                return;
            
            // Save as file
            chrome.downloads.download({
                url: 'data:text/plain;base64,' + btoa(bookmakerToCvs(obj.bookmaker)),
                filename: 'bookmaker.csv'
            });
        });
    });

    document.getElementById('clear').addEventListener('click', function () {
        chrome.storage.local.remove('bookmaker', function (obj) {
            console.log("bookmaker removed");
        });
    });
});