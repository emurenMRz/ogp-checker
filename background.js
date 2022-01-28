function listener(message, port) {
	if (!message.tabId)
		return;

	const exec = { target: { tabId: message.tabId } };
	switch (message.comand) {
		case 'inject':
			exec.files = [message.file];
			chrome.scripting.executeScript(exec, results => port.postMessage(results[0].result));
			break;

		case 'get-ogp':
			exec.func = () => extractOGPTags();
			chrome.scripting.executeScript(exec, results => port.postMessage(results[0].result));
			break;

		case 'get-image':
			fetch(message.url)
				.then(r => r.blob())
				.then(blob => {
					const file = new FileReader();
					file.onload = e => port.postMessage(e.target.result);
					file.readAsDataURL(blob);
				});
			break;
	}
}

chrome.runtime.onConnect.addListener(port => {
	if (port.name == 'devtools-page') {
		port.onMessage.addListener(listener);
		port.onDisconnect.addListener(port => port.onMessage.removeListener(listener))
	}
})
