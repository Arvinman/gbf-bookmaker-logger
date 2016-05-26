window.addEventListener("load", inject, false);

function inject(evt) {
    console.log("finding point!");
    
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {

        var elem = document.getElementsByClassName("prt-head-current");
        if (elem.length == 0 ||
            (elem[0].textContent != 'Bookmaker' && elem[0].textContent != 'Place a Bet' &&
            elem[0].textContent != 'ブックメーカー' && elem[0].textContent != '勝利エリア予想'))
            return;

        var areaList = document.querySelectorAll(".lis-area .point");
        if (areaList.length == 0)
            return;

        console.log("found point!");
        // N W E S
        console.log(
            areaList[0].textContent + ',' +
            areaList[1].textContent + ',' +
            areaList[2].textContent + ',' +
            areaList[3].textContent);
            
        // Save it using the Chrome extension storage API.
        var record = {
            time: new Date().toLocaleTimeString(),
            n: areaList[0].textContent,
            w: areaList[1].textContent,
            e: areaList[2].textContent,
            s: areaList[3].textContent,
        };

        chrome.storage.local.get('bookmaker', function (obj) {
            if (obj.hasOwnProperty('bookmaker')) {

                var bookmaker = obj.bookmaker;
                //get last record
                var latestRecord = bookmaker[bookmaker.length - 1];
                if (latestRecord.n == record.n &&
                    latestRecord.w == record.w &&
                    latestRecord.e == record.e &&
                    latestRecord.s == record.s)
                    return; // same record, do nothing
                    
                bookmaker.push(record)
                chrome.storage.local.set(obj, function () {
                    console.log('record added');
                });
            }
            else {
                chrome.storage.local.set({ 'bookmaker': [record] }, function () {
                    console.log('record added');
                });
            }
        });
    });

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };

    // pass in the target node, as well as the observer options
    var element = document.getElementsByClassName("contents").length > 0
        ? document.getElementsByClassName("contents")[0]
        : document.getElementsByClassName("mobage-game-container")[0];
    observer.observe(element, config);


};
