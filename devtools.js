chrome.devtools.panels.create("OGP Checker", null, "panel/panel.html", panel => {
	const bgpConnect = chrome.runtime.connect({ name: "devtools-page" });
	bgpConnect.postMessage({
		tabId: chrome.devtools.inspectedWindow.tabId,
		comand: 'inject',
		file: "content-script.js"
	});
});
