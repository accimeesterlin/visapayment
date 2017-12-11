const request = require('request');
const crypto = require('crypto');

const secret_key = ''; // add your secret key 
const api_key = ''; // add your api key

const body = JSON.stringify({
	"amount": "20",
		"currency": "USD",
		"payment": {
			"cardNumber": "4111111111111111",
			"cardExpirationMonth": "10",
			"cardExpirationYear": "2020"
		}
});



// Generating a X-PAY-TOKEN
const getXPayToken = () => {
	const timestamp = Math.floor(Date.now() / 1000); 
	const sharedSecret = secret_key; 
	const queryParams = 'apikey=' + api_key; 
	const resourcePath = 'payments/v1/authorizations';
	const preHashString = timestamp + resourcePath + queryParams + body;
	const hashString = crypto.createHmac('SHA256', sharedSecret).update(preHashString).digest('hex');
	const xPayToken = 'xv2:' + timestamp + ':' + hashString;
	console.log("X-PAY-TOKEN: ", xPayToken);
	return xPayToken;	
}


// Making a requesst
const requestTransaction = () => {
	const token = getXPayToken();
	request({
		uri:'https://sandbox.api.visa.com/cybersource/payments/v1/authorizations?apikey=' + api_key, 
		method:'POST',
		body: body,
		headers:{
			'Content-Type':'application/json',
			'Accept':'application/json',
			'x-pay-token': token
		}
	}, (err, response, body) => {
		if(err){
			console.log(err)
		} else{
			console.log("Body: ", body);
		}
	});
}

requestTransaction(); // invoking the requestTransaction function
