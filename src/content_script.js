window.addEventListener("load", inject, false);

function inject(evt) {
    console.log("finding point!");
    var elem = document.getElementsByClassName("contents");

    // create an observer instance
    var observer = new MutationObserver(function (mutations) {

        var areaList = document.querySelectorAll(".lis-area .point");
        if (areaList.length > 0) {
            console.log("found point!");
            console.log(areaList[0].textContent); // N
            console.log(areaList[1].textContent); // W
            console.log(areaList[2].textContent); // E
            console.log(areaList[3].textContent); // S
            observer.disconnect();
            
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
        }
    });

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };

    // pass in the target node, as well as the observer options
    observer.observe(elem[0], config);


};
