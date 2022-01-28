function extractOGPTags() {
	const heads = document.getElementsByTagName('head');
	if (!heads)
		return null;

	const head = Array.prototype.slice.call(heads[0].children);
	const title = head.find(e => e.tagName == 'TITLE')?.textContent;
	const meta = head.filter(e => e.tagName == 'META' && (('name' in e.attributes) || ('property' in e.attributes)));
	const description = meta.find(e => e.name == 'description')?.content;

	const extract = (name, sign) => {
		const r = {};
		meta.filter(e => e.attributes[name] && !e.attributes[name].value.indexOf(sign))
			.map(e => r[e.attributes[name].value] = e.attributes.content.value);
		return r;
	};
	const basic = { title, description };
	const ogp = extract('property', 'og:');
	const twitter = extract('name', 'twitter:');
	const facebook = extract('property', 'fb:');
	return Object.assign(basic, ogp, twitter, facebook);
}
