const crawler = require('crawler-request');
var cheerio = require('cheerio');
//cheerio를 이용해서 크롤링 불가.. => crawler-request사용 

const fs = require('fs');
var url = "http://www.ajou.ac.kr/main/life/food.jsp";

//enter를 없애기 위해서 삽입
const enterReg = /(\r\n|\n|\r)/gm;
let unionDiner;

let domDiner;

let officeDiner;

let officeDiner2;

var strArray;
// const dinerList = [unionDiner, domDiner, officeDiner1, officeDiner2];

//식단 찾는것 자체를 함수화
function findDiner(diner){
    let stuDinerM ="";
    let stuDinerL ="";
    let stuDinerD ="";
    let stuDinerS ="";

    if(diner.indexOf('등록된 식단이 없습니다.') != -1)
    {
        console.log(diner[2]);
        //리턴
        return;
    }else{
        let m = diner.indexOf('아침');
        let l = diner.indexOf('점심');
        let d = diner.indexOf('저녁');
        let s = diner.indexOf('분식');

        if(m != -1){
            for(let i = m; i<l; i++){
                // console.log(stuDiner[i])
                stuDinerM = stuDinerM.concat(diner[i]+'\n');
            }
        }
        if(l != -1){
            for(let i = l; i<d; i++){
                // console.log(stuDiner[i])
                stuDinerL = stuDinerL.concat(diner[i]+'\n');
            }
        }
        if(d != -1){
            if(s != -1){
                for(let j = d; j<s;j++){
                    stuDinerD = stuDinerD.concat(diner[j]+'\n');
                }                
            }
            else{
                for(let j = d; j<diner.length;j++){
                    stuDinerD = stuDinerD.concat(diner[j]+'\n');
                }
            }

        }
        if(s != -1){
            for(let k = s; k<diner.length;k++){
                stuDinerS = stuDinerS.concat(diner[k]+'\n');
            }
        }
        // console.log(stuDinerL);
        // console.log('\n');
        // console.log(stuDinerD);
        // console.log('\n');
        // console.log(stuDinerS);
        diner = "";
        diner = [stuDinerM, stuDinerL, stuDinerD, stuDinerS];
        // stuDinerM ="", stuDinerL="",stuDinerD="",stuDinerS="";
        // console.log(diner);
        return diner;
    }

}

crawler(url).then(function(response){
    // console.log(response.html);

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
            unionDiner = findDiner(unionDiner);  
            // console.log(unionDiner);

        }else if(idx == 1){
            domDiner = strArray;
            domDiner = findDiner(domDiner);
            // console.log(domDiner);

        }else if(idx == 2){
            officeDiner1 = strArray;
            officeDiner1 = findDiner(officeDiner1);
            // console.log(officeDiner1);

        }else if(idx == 3){
            officeDiner2 = strArray;
            officeDiner2 = findDiner(officeDiner2);
            // console.log(officeDiner2);

        }  
    })
    
});
