var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');

var url = "https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EC%98%81%ED%86%B5%EA%B5%AC+%EC%9B%90%EC%B2%9C%EB%8F%99+%EB%82%A0%EC%94%A8&oquery=%EC%98%81%ED%86%B5%EA%B5%AC+%EB%82%A0%EC%94%A8&tqi=U6iZ%2BspVuE8ssuYzaTwssssssTG-238148";


router.post('/', function(req,res,err){
	
	request(url, function(err, response, body){
    var $ = cheerio.load(body);
	var where = $('h3.api_title').text();
    // console.log(where);
    var txt = $('p.cast_txt').first().text();
    // console.log(txt);
    var totalText = `오늘 아주대 ${where}는 ${txt}`;
    console.log(totalText);
    // console.log('2');

	const responseBody ={
		version : "2.0",
		data :{
			weather : `${totalText}`
		}
	};
	res.status(200).send(responseBody);
	});

});

module.exports = router;