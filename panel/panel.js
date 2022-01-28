const $ = id => document.getElementById(id);


function getProperty(data, ...names) {
	for (const name of names)
		if (name in data && data[name].length > 0)
			return data[name];
	return 'No property: ' + JSON.stringify(names);
}


function buildTagTable(entries) {
	const col = v => { const td = document.createElement('td'); td.textContent = v; return td; }
	const table = document.createElement('table');
	for (const entry of entries) {
		const tr = document.createElement('tr');
		tr.appendChild(col(entry[0]));
		tr.appendChild(col(entry[1]));
		table.appendChild(tr);
	}
	return table;
}


function updatePanel() {
	const bgpConnect = chrome.runtime.connect({ name: "devtools-page" });
	bgpConnect.postMessage({
		tabId: chrome.devtools.inspectedWindow.tabId,
		comand: 'get-ogp'
	});
	bgpConnect.onMessage.addListener(data => {
		const imageURL = getProperty(data, 'og:image', 'twitter:image');
		$('article-image').textContent = 'loading...';
		$('domain').textContent = getProperty(data, 'og:url', 'twitter:url').replace(/https?:\/\/([^\/]+).*/, '$1');
		$('article-title').textContent = getProperty(data, 'og:title', 'twitter:description', 'title');
		$('article-summary').textContent = getProperty(data, 'og:description', 'twitter:description', 'description');

		const result = $('result');
		result.textContent = '';
		result.appendChild(buildTagTable(Object.entries(data)));

		const conn = chrome.runtime.connect({ name: "devtools-page" });
		conn.postMessage({
			tabId: chrome.devtools.inspectedWindow.tabId,
			comand: 'get-image',
			url: imageURL
		});
		conn.onMessage.addListener(dataUrl => {
			const ai = $('article-image');
			ai.textContent = '';
			ai.style.backgroundImage = `url(${dataUrl})`;
		});
	});
}


addEventListener('load', () => updatePanel());


chrome.devtools.network.onNavigated.addListener(url => {
	const conn = chrome.runtime.connect({ name: "devtools-page" });
	conn.postMessage({
		tabId: chrome.devtools.inspectedWindow.tabId,
		comand: 'inject',
		file: "content-script.js"
	});
	conn.onMessage.addListener(() => updatePanel());
});