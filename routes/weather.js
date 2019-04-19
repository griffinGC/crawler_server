var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');

var url = "https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EC%98%81%ED%86%B5%EA%B5%AC+%EC%9B%90%EC%B2%9C%EB%8F%99+%EB%82%A0%EC%94%A8&oquery=%EC%98%81%ED%86%B5%EA%B5%AC+%EB%82%A0%EC%94%A8&tqi=U6iZ%2BspVuE8ssuYzaTwssssssTG-238148";
var url2 = "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&query=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%88%98%EC%9B%90%EC%8B%9C%20%EC%98%81%ED%86%B5%EA%B5%AC%20%EC%9B%90%EC%B2%9C%EB%8F%99%20%EB%AF%B8%EC%84%B8%EB%A8%BC%EC%A7%80";

router.post('/', function(req,res,err){
	
	request(url, function(err, response, body){
    var $ = cheerio.load(body);
	var where = $('h3.api_title').text();
	// console.log(where);
	var todayTemp = $('span.todaytemp').first().text();
    var txt = $('p.cast_txt').first().text();
    // console.log(txt);
    var totalText = `오늘 아주대 ${where}는 ${txt}.`+'\n'+`현재기온은 ${todayTemp}도 입니다.`;
    console.log(totalText);
    // console.log('2');
	var result;
    var resultList=['좋음','보통','나쁨','매우 나쁨']
    var dust;
    request(url2, function(err, response, body){
        var $ = cheerio.load(body);
        dust = $('em.main_figure').text();

        if(dust<=30)
        {
            result = resultList[0];
        }else if(dust <=80)
        {
            result = resultList[1];
        }else if(dust <= 150)
        {
            result = resultList[2];
        }else{
            result = reusltList[3];
        }
        dust = dust + '㎍/㎥';
        result = `미세먼지 수치는 ${dust}이고, 상태는 ${result}입니다.`
        //미세먼지
		console.log(result);
		result = totalText +"\n"+ result;
			const responseBody ={
				version : "2.0",
				data :{
					weather : `${result}`
				}
			};
			res.status(200).send(responseBody);
    	});
	
	});

});

module.exports = router;