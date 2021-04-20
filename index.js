let g_szBasicOrigin = 'https://tbot.xyz/';
let g_szApiSetScoreUrl = 'https://tbot.xyz/api/setScore';

let g_objPostData = {
	credentials: "omit",
	headers: {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0",
		"Accept": "*/*",
		"Content-Type": "text/plain;charset=UTF-8"
	},
	body: '',
	method: "POST",
	referrerPolicy: "no-referrer",
	mode: "no-cors"
}

let g_szFetch = `await fetch("${g_szApiSetScoreUrl}",`;

let g_objFetchData = {
    "credentials": "omit",
    "headers": {
        "User-Agent": "",
        "Accept": "*/*",
        "Accept-Language": "en-GB,en;q=0.5",
        "Content-Type": "text/plain;charset=UTF-8"
    },
    "referrer": "",
    "body": "",
    "method": "POST",
    "mode": "cors"
}

let g_szPostObj = JSON.stringify(g_objPostData);


window.copyValue__ = function(uiIndex) {
	let ucTemp = uiIndex === 1 ? 'c' : 'd';

	let temp = document.getElementById(ucTemp);
	temp.select();

	document.execCommand('copy');
}

/* window.safeDecodeURIComponent = (str) => { */
window.safeDecodeURIComponent = function (str) {
	try {
		return decodeURIComponent(str)
	}
	catch (e) {
		return str;
	}
}

window.getCustomObject = function (str) {
	str = str.replaceAll('#', '');
	let ret = {};

	if(str.length === 0) return ret;

	if(str.indexOf('=') === -1 && str.indexOf('?') === -1) {
		ret._path = safeDecodeURIComponent(str);
		return ret;
	}

	let iPos = str.indexOf('?');

	if(iPos !== -1) {
		let szTempStr_ = str.substr(0, iPos);
		ret._path = safeDecodeURIComponent(szTempStr_);
		str = str.substr(iPos + 1);
	}

	let tempArray = str.split('&');
	for (let i = 0, l = tempArray.length, tempArray2, szTempKey, szTempValue; i < l; i++) {
		tempArray2 = tempArray[i].split('=');
		szTempKey = safeDecodeURIComponent(tempArray2[0]);
		if(tempArray2[1] !== undefined && tempArray2[1] !== null) {
			szTempValue = safeDecodeURIComponent(tempArray2[1]);

			ret[szTempKey] = szTempValue;
		}
	}

	return ret;
}

window.generateArrayOfParams = function(ScoreObject) {
	const tempArray = [];

	for (const key in ScoreObject) {
		tempArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(ScoreObject[key])}`);
	}

	return tempArray;
}

window.apiSetScore = async function(szUrl, szReferrer, szOrigin, ScoreObject) {
	let tempArray = generateArrayOfParams(ScoreObject);
	let szTempString = tempArray.join('&');

	const objPostData = JSON.parse(g_szPostObj);
	// objPostData.referrer = szReferrer;
	// objPostData.origin = szOrigin;
	objPostData.body = szTempString;

	return fetch(g_szApiSetScoreUrl, objPostData);
}

window.generateShareLink = function() {
	let szUrl = getCurrentUrlStrict();
	if(szUrl === undefined) return;

	let tempUrlObject = getTemporaryURLObject(szUrl);
	let parsedObj = getCustomObject(tempUrlObject.hash);

	let szShareLink = parsedObj.tgShareScoreUrl || parsedObj.shareScoreUrl;
	document.getElementById('c').value = szShareLink;
}

window.getLocationHashString = function(str) {
	let szReturnString = (str || "").substr(1);
    szReturnString = szReturnString.replace(/[\?&].*/g, "");

	return szReturnString;
}

window.getCurrentUrlStrict = function(bDecode) {
	try {
		let szUrl = document.getElementById('a').value;
		if(bDecode === true) szUrl = decodeURIComponent(szUrl);

		if(!szUrl.startsWith(g_szBasicOrigin)) {
			alert("Probably link is not valid.");

			return undefined;
		}

		return szUrl;
	}
	catch(e) {
		console.error(e);
		return undefined;
	}
}

window.getCurrentScoreStrict = function() {
	try {
		let iScore = document.getElementById('b').value - 0;

		if(iScore === NaN || iScore <= 0 || iScore % 1 !== 0) {
			alert("Needed score is not valid.");

			return undefined;
		}

		return iScore;
	}
	catch(e) {
		console.error(e);
		return undefined;
	}
}

window.getTemporaryURLObject = function(szUrl) {
	if(!szUrl) return undefined;

	let tempUrlObject = new URL(szUrl);

	return tempUrlObject;
}

window.generateFetch = function() {
	let szUrl = getCurrentUrlStrict(true);
	if(szUrl === undefined) return;

	let iScore = getCurrentScoreStrict();
	if(iScore === undefined) return;

	let tempUrlObject = getTemporaryURLObject(szUrl);
	let szReferrer = `${tempUrlObject.origin}${tempUrlObject.pathname}`;

	let objScore = { data: getLocationHashString(tempUrlObject.hash), score: iScore }

	let tempArray = generateArrayOfParams(objScore);
	let szTempString = tempArray.join('&');

	g_objFetchData.headers["User-Agent"] = navigator.userAgent;
	g_objFetchData.referrer = szReferrer;
	g_objFetchData.body = szTempString;

	document.getElementById('d').value = `${g_szFetch} ${JSON.stringify(g_objFetchData, null, 4)});`;
}

window.openShareLink = function() {
	let szShareLink = document.getElementById('c').value;

	if(szShareLink.length === 0) return;

	window.open(szShareLink, "_blank");
}

window.prepareEverything = async function() {
	let szUrl = getCurrentUrlStrict(true);
	if(szUrl === undefined) return;

	let iScore = getCurrentScoreStrict();
	if(iScore === undefined) return;

	let tempUrlObject = getTemporaryURLObject(szUrl);
	let szReferrer = `${tempUrlObject.origin}${tempUrlObject.pathname}`;

	let objScore = { data: getLocationHashString(tempUrlObject.hash), score: iScore }

	try {
		let response = await apiSetScore(szUrl, szReferrer, tempUrlObject.origin, objScore);
		alert("Done.");

		// Fetch requests with 'no-cors' params do not support any real responses, while network tab is still working.
/*
		let c = await response.json();
		if(c.error) alert("Failed.");
		else alert("Done.");
*/
	}
	catch (e) {
		alert("Failed.");
	}
}
