if (!window.responses) window.responses = {};

(function (responses) {
	var invalidKey = '{"code":4010,"message":"Invalid Key. For more information see http://ideal-postcodes.co.uk/documentation/response-codes#4010"}';

	responses.invalidKey = {	
		status: 401,
		contentType: "application/json",
		responseText: invalidKey
	};
	
}(window.responses));
