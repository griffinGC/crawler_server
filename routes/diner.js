const express = require('express');
const router = express.Router();
const crawler = require('crawler-request');
var cheerio = require('cheerio');
//cheerio를 이용해서 크롤링 불가.. => crawler-request사용 
const fs = require('fs');
var url = "http://www.ajou.ac.kr/main/life/food.jsp";

//enter를 없애기 위해서 삽입
const enterReg = /(\r\n|\n|\r)/gm;
let unionDiner;

let domDiner;

let officeDiner1;

let officeDiner2;

var strArray;
const dinerList = [unionDiner, domDiner, officeDiner1, officeDiner2];

//식단 찾는것 자체를 함수화
function findDiner(diner){
    let stuDinerM ="";
    let stuDinerL ="";
    let stuDinerD ="";
    let stuDinerS ="";

    if(diner.indexOf('등록된 식단이 없습니다.') != -1)
    {
        // console.log(diner[2]);
        var temp = diner[2];
        console.log(temp);
        diner = "";
        diner = [temp,temp];
        //리턴
        return diner;
    }else{
        let m = diner.indexOf('아침');
        let l = diner.indexOf('점심');
        let d = diner.indexOf('저녁');
        let s = diner.indexOf('분식');

        //학식
        if((m== -1)&& (l!=-1) && (d == -1))
        {
            for(let i = 3; i<s; i++)
            {
                stuDinerL = stuDinerL.concat(diner[i]+'\n');
            }
            for(let i = s; i<diner.length; i++)
            {
                stuDinerS = stuDinerS.concat(diner[i]+'\n');
            }
            diner ="";
            diner = [stuDinerL,stuDinerS];
            return diner;
        }

        //기식
        if((m!= -1) && (l!= -1) && (d != -1))
        {
            for(let i = m+1; i< l; i++)
            {
                stuDinerM = stuDinerM.concat(diner[i] + '\n');
            }
            for(let i = l+1; i< d; i++)
            {
                stuDinerL = stuDinerL.concat(diner[i] + '\n');
            }
            for(let i = d+1; i< diner.length; i++)
            {
                stuDinerD = stuDinerD.concat(diner[i] + '\n');
            }
            diner ="";
            diner = [stuDinerM,stuDinerL,stuDinerD];
            return diner;
        }
        //교식
        if((m == -1) && (l != -1) && (d != -1))
        {
            for(let i = l+1; i<d; i++)
            {
                stuDinerL = stuDinerL.concat(diner[i]+'\n');
            }
            for(let i = d+1; i<diner.length; i++)
            {
                stuDinerD = stuDinerD.concat(diner[i]+'\n');
            }
            diner ="";
            diner = [stuDinerL,stuDinerD];
            return diner;
        }
    }

}

router.post('/0', (req, res)=>{
    crawler(url).then(function(response){
       
    //보완필요
    var $ = cheerio.load(response.html);


    //tri_list02 이용해서 가져오면 식단 없을경우 크롤링 불가. 
    //여기는 앞뒤가 생략가능함
    $('table.ajou_table').each(function(idx){ 
        //문자열을 한줄씩 배열에 넣어 쪼개고 개행키는 삭제 다시 한줄씩 출력 
        var diner = $(this).text();
        //개행키로 나눔 
        strArray = diner.split('\n');
        //기존에 존재하는 문자열의 앞뒤 공백 삭제 
        for(let i = 0; i<strArray.length; i++){
            strArray[i] = strArray[i].trim();
        }
        //값이 존재하는것 들만 필터링 함
        strArray = strArray.filter(n=>n);
        // console.log(strArray);

        
        if(idx == 0){
            unionDiner = strArray;
            // console.log(strArray);
            unionDiner = findDiner(unionDiner);  
            // console.log(unionDiner);

        }  
    });
    console.log(unionDiner);
    var result = unionDiner[0] + unionDiner[1];
    const responseBody ={
            version : "2.0",
            data :{
                msg : `${result}`
            }
        };
        res.status(200).send(responseBody);
    });
});

router.post('/1/:id', (req, res)=>{
    crawler(url).then(function(response){
       
    //보완필요
    var $ = cheerio.load(response.html);


    //tri_list02 이용해서 가져오면 식단 없을경우 크롤링 불가. 
    //여기는 앞뒤가 생략가능함
    $('table.ajou_table').each(function(idx){ 
        //문자열을 한줄씩 배열에 넣어 쪼개고 개행키는 삭제 다시 한줄씩 출력 
        var diner = $(this).text();
        //개행키로 나눔 
        strArray = diner.split('\n');
        //기존에 존재하는 문자열의 앞뒤 공백 삭제 
        for(let i = 0; i<strArray.length; i++){
            strArray[i] = strArray[i].trim();
        }
        //값이 존재하는것 들만 필터링 함
        strArray = strArray.filter(n=>n);
        // console.log(strArray);
        if(idx == 1){
            domDiner = strArray;
            // console.log(strArray);
            domDiner = findDiner(domDiner);
            // console.log(domDiner);

        }  
    });
    var result ="";
    if(req.params.id == 0)
    {
        result = domDiner[0];
        console.log(domDiner[0]);
    }else if(req.params.id == 1){
        result = domDiner[1];
        console.log(domDiner[1]);
    }else if(req.params.id == 2){
        result = domDiner[2];
        console.log(domDiner[2]);
    }
    
    const responseBody ={
            version : "2.0",
            data :{
                msg : `${result}`
            }
        };
        res.status(200).send(responseBody);
    });
});


router.post('/2/:id', (req, res)=>{
    crawler(url).then(function(response){
       
    //보완필요
    var $ = cheerio.load(response.html);


    //tri_list02 이용해서 가져오면 식단 없을경우 크롤링 불가. 
    //여기는 앞뒤가 생략가능함
    $('table.ajou_table').each(function(idx){ 
        //문자열을 한줄씩 배열에 넣어 쪼개고 개행키는 삭제 다시 한줄씩 출력 
        var diner = $(this).text();
        //개행키로 나눔 
        strArray = diner.split('\n');
        //기존에 존재하는 문자열의 앞뒤 공백 삭제 
        for(let i = 0; i<strArray.length; i++){
            strArray[i] = strArray[i].trim();
        }
        //값이 존재하는것 들만 필터링 함
        strArray = strArray.filter(n=>n);
        // console.log(strArray);
        if(idx == 2){
            officeDiner1 = strArray;
            officeDiner1 = findDiner(officeDiner1);
            // console.log(officeDiner1 + "1");

        }
    });
    var result ="";
    if(req.params.id == 0)
    {
        result = officeDiner1[0];
        console.log(officeDiner1[0]);
    }else if(req.params.id == 1){
        result = officeDiner1[1];
        console.log(officeDiner1[1]);
    }
    
    const responseBody ={
            version : "2.0",
            data :{
                msg : `${result}`
            }
        };
        res.status(200).send(responseBody);
    });
});

module.exports = router;