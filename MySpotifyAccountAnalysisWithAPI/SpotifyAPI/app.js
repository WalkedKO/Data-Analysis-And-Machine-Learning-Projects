const clientId = 'f5a550f196024d11bbe943e055b2a6a6';
const redirectUri = 'http://127.0.0.1:3000';

const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const codeVerifier  = generateRandomString(64);

const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}
const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
async function onClick(){
	
	const hashed = await sha256(codeVerifier)
	const codeChallenge = base64encode(hashed)
	
	

	const scope = 'user-top-read';
	const authUrl = new URL("https://accounts.spotify.com/authorize")

	// generated in the previous step
	window.localStorage.setItem('code_verifier', codeVerifier);

	const params =  {
	  response_type: 'code',
	  client_id: clientId,
	  scope,
	  code_challenge_method: 'S256',
	  code_challenge: codeChallenge,
	  redirect_uri: redirectUri,
	}

	authUrl.search = new URLSearchParams(params).toString();
	window.location.href = authUrl.toString();
	
}
async function analyse()
{
	let link = document.getElementById("link").value
	let urlnew = new URL(link)
	const urlParams = new URLSearchParams(urlnew.search);
	let code = urlParams.get('code');
	 
	 
	 const codeVerifier = localStorage.getItem('code_verifier');

	  let url = "https://accounts.spotify.com/api/token";
	  const payload = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
		  client_id: clientId,
		  grant_type: 'authorization_code',
		  code,
		  redirect_uri: redirectUri,
		  code_verifier: codeVerifier,
		}),
	  }

	  const body = await fetch(url, payload);
	  const response = await body.json();
	  const token = response.access_token
	console.log(token)
	
}