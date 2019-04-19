var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
const crawler = require('crawler-request');
    //c1열람실 
    // var url ="http://u-campus.ajou.ac.kr/ltms/rmstatus/vew.rmstatus?bd_code=JL&rm_code=JL0C1"
    //d1열람실
    // var url ="http://u-campus.ajou.ac.kr/ltms/rmstatus/vew.rmstatus?bd_code=JL&rm_code=JL0D1"
    
    // let url ="http://u-campus.ajou.ac.kr/ltms/rmstatus/vew.rmstatus?bd_code=JL&rm_code=JL0";
    var urlList = ["http://u-campus.ajou.ac.kr/ltms/rmstatus/vew.rmstatus?bd_code=JL&rm_code=JL0C1","http://u-campus.ajou.ac.kr/ltms/rmstatus/vew.rmstatus?bd_code=JL&rm_code=JL0D1"]
    var url;
    
var result;
router.post('/:where', (req,res) =>{
        var imgLink
        var list = ["http://u-campus.ajou.ac.kr/ltms/temp/241.png","http://u-campus.ajou.ac.kr/ltms/temp/261.png"]
        if(req.params.where == "c1")
        {
            imgLink = list[0];
            url = urlList[0];
            console.log(url);
        }else if(req.params.where == "d1")
        {
            imgLink = list[1];
            url = urlList[1];
            console.log(url);

        }
        crawler(url).then(function(response){
            var $ = cheerio.load(response.html);
            var seatStatus;
            var seatPercent;
            var info;
            $('td').each(function(idx){
                var temp = $(this).text();
                var strArray = temp.split('\n');
                
                //기존에 존재하는 문자열의 앞뒤 공백 삭제 
                for(let i = 0; i<strArray.length; i++){
                    strArray[i] = strArray[i].trim();
                }
            //값이 존재하는것 들만 필터링 함
            strArray = strArray.filter(n=>n);
            // console.log(strArray);
            if(idx == 2){
                info = strArray[0];
            }else if(idx == 4){
                seatStatus = strArray[2];
                seatPercent = strArray[4];
            }
            });
            console.log(info);
            console.log(seatStatus);
            console.log(seatPercent);
            result = info +'\n' + seatStatus + '\n' + "사용률 : " + seatPercent;
            const responseBody ={
            version : "2.0",
            data :{
                info : `${result}`,
                img : `${imgLink}`
                }
            };
            
            res.status(200).send(responseBody);
        });
})

module.exports = router;