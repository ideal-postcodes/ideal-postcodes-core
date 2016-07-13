if (!window.responses) window.responses = {};

(function (responses) {
	responses["ping"] = {
		status: 200,
		contentType: "application/json",
		responseText: '{"result":"Thanks for trying ideal-postcodes.co.uk. To find out how to use this api please visit https://ideal-postcodes.co.uk/documentation","code":2000,"message":"Success"}'
	};
}(window.responses));
