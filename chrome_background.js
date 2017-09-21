chrome.browserAction.onClicked.addListener(function(activeTab){
  var newURL = "https://tradingview.binary.com/";
  chrome.tabs.create({ url: newURL });
});