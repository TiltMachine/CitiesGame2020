jQuery(document).ready(function($) {
    var population,tempString;
    var imgSrc;
    var turn = 1, p1score = 0, p2score = 0, p1hp = 3, p2hp = 3;
    var ErrorStatus = false;
    var arrayCities = [];
    var timer=undefined;


    $("#popup_overlay").click(function () {
        $("#popup, #popup_overlay").hide();
    });


    function myClick(){

        

        ErrorStatus=false;
        //console.log("Button Clicked");

        var input = $("#input").val();
        input = clear(input);
        
        $.get("https://geo.koltyrin.ru/goroda_poisk.php?city="+input+"", function(data) {
            
            
            const htmlString = data;
            const parser = new DOMParser();
            var document = parser.parseFromString(htmlString, 'text/html');

            var rows = document.querySelector("body > div.global > div > div.field_center > div:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(2)");

            try{
                tempString = rows.innerText;
                //console.log(rows.innerText);
                
                var mas=tempString.split("");

                population="";
                while(/[^[0-9]/.test(mas[0]))
                    mas.splice(0,1);
                for(i=0;i<mas.length;i++){
                    if ((mas[i].charCodeAt()>47) && (mas[i].charCodeAt()<58))
                        population+=mas[i];
                    else if ((mas[i].charCodeAt()===32)||(mas[i]==='\u00A0'))
                        continue;
                    else 
                        break;
                }
                population=parseInt(population);
                console.log(population);

            }
            catch(err){
                console.log("Этого города нет в базе данных");
                Error("Такой город нам неизвестен!");
            }
        }).done(function() {
            var url = "https://yandex.ru/images/search?text=город%20"+input;
            //var url = "https://duckduckgo.com/?q=город+"+input+"&=h_&iar=images&iax=images&ia=images";
            console.log("in: "+ url);
            $.get(url, function(d) {
                    const htmlString = d;
                    //console.log(htmlString);
                    const parser = new DOMParser();
                    var document = parser.parseFromString(htmlString, 'text/html');
                    var pics = document.querySelectorAll("div > a > img");
                    //var pics = document.querySelectorAll("#zci-images > div > div.tile-wrap > div > div:nth-child(3) > div.tile--img__media > span > img");
                    //console.log(pics);
                    imgSrc = "https:"+$(pics[0]).attr("src");
                    
                    console.log(imgSrc);
                }).done(function() {

                    if(!ErrorStatus){
                        checkCity(input);
                    }


                });

                
            })
            .fail(function() {
            console.log("ERROR: 404 страницы не существует!");
            Error("Такой город нам неизвестен!");
            });

    }
    
    $("#enter").click(function(){
        myClick()
    });
    $("#input").keypress(function(event) {
        if (event.keyCode == 13)
            myClick();
    });
    

    function Error(message){
        ErrorStatus = true;
        HPloss(turn);
        $(".alert-danger").text(message);
        $(".alert-danger").show('350');
    
        setTimeout(function () {
            $(".alert-danger").hide('350');
        }, 3000);




    }

    function checkCity(city){
        city = city.toLowerCase();
        //city = clear(city);
        if (arrayCities.length == 0){

            arrayCities.push(city);

            console.log(arrayCities);
            SetTimer(15);
            forFirstChar(city);
            Card(city);

            AddScore(turn);
        }
        else if(arrayCities.indexOf(city)==-1){
            var firstChar = city[0];
            var firstCharCapital = firstChar.toUpperCase();

            var prev = arrayCities[arrayCities.length-1];
            var prev2 = arrayCities[arrayCities.length-2];

            var prev_lastChar=prev[prev.length -1];

            if(prev_lastChar == 'ь' || prev_lastChar == 'ъ')
                prev_lastChar = prev[prev.length -2];
            

            var prev_lastCharCapital = prev_lastChar.toUpperCase();
            //console.log(prev_lastChar);
            if(firstChar == prev_lastChar || firstCharCapital == prev_lastCharCapital){
                arrayCities.push(city);
                console.log(arrayCities);
                
                clearInterval(timer);
                if (arrayCities.length<5) SetTimer(15);
                else if (arrayCities.length<10) SetTimer(30);
                else SetTimer(55);
                forFirstChar(city);
                Card(city);

                AddScore(turn);

                $("#second").text(firstLetter(prev));
                try{
                $("#third").text(firstLetter(prev2));
                }
                catch(err){
                }
            }
            else    
                Error("Город должен начинаться с буквы "+prev_lastCharCapital);
        }
        else
            Error("Такой город уже называли!");
    }

    function firstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function forFirstChar(city){
        var lastChar = city[city.length-1];

        if(lastChar== 'ь' || lastChar == 'ъ'){
            var before_lastChar = city[city.length-2];
            $("#addon-wrapping").text(before_lastChar.toUpperCase());
            $("#first").text(firstLetter(city).slice(0,city.length-2));
            $("#first").append("<div id='lastletter'>"+before_lastChar+"</div><div id='lastletterExc'>"+lastChar+"</div>"); 
        }else{
            $("#addon-wrapping").text(lastChar.toUpperCase());
            $("#first").text(firstLetter(city).slice(0,city.length-1));
            $("#first").append("<div id='lastletter'>"+lastChar+"</div>");
        }

        
    }
    
    function Card(city){
        //console.log(city);
        //city = clear(city);
        //console.log(city);
        $(".card img").attr("src",imgSrc);
        $(".card-title").text(firstLetter(city));
        $(".card-text").text("Население: "+population+" чел.");
        $("#wikiLink").attr("href","https://ru.wikipedia.org/wiki/"+city+"");
    }

    function AddScore(player){
        $("#p"+player+"_score_add").text("+"+population);

        //$("#p"+player+"_score_add").css({opacity: 1});
        $("#p"+player+"_score_add").fadeTo('fast',1);
        //$("#p1_score_add").show('slow');
        //$("#p2_score_add").show('slow');

        setTimeout(function () {
            //$("#p"+player+"_score_add").css({opacity: 0});
            $("#p"+player+"_score_add").fadeTo('fast',0);
            // $("#p1_score_add").hide('slow');
            //$("#p2_score_add").hide('slow');
            
        }, 1500);

        if(player == 1){
            p1score+= population;
            $("#p1_score").text(p1score);
            //$("#p1_score_add").show('slow');
            turn++;
        }
        else{
            p2score+= population;
            $("#p2_score").text(p2score);
            turn--;
        }
    }

    function HPloss(p){
        

        if (p==1){
            $("#p1_HP"+p1hp).replaceWith("<svg class='bi bi-heart' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z'/></svg>");
            p1hp--;
            if(p1hp==0){
                gameOver(p);
            }
        }
        else{
            $("#p2_HP"+p2hp).replaceWith("<svg class='bi bi-heart' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z'/></svg>");
            p2hp--;
            if(p2hp==0){
                gameOver(p);
            }
        }
    }

    function clear(name){
        var str=name.split("");
        var newstr="";
        while(str[0].charCodeAt()===32) str.splice(0,1);
        while(str[str.length-1].charCodeAt()===32) str.splice(str.length-1,1);
        console.log(str);
        for(i=0;i<str.length;i++){
        if(str[i]==='-')
        str[i+1]=str[i+1].toUpperCase();
        newstr+=str[i];
        }
        return newstr;
        }

function SetTimer(time) //time - ����� ��� ��������� �������
{
    timer=setInterval(function() {
                if (time>9) $('#timer').text(":"+time+"");
                else $('#timer').text(":0"+time+"");
                if (time>0) time--; //��������� �������
                else //����� - ���������� ����� � ��� �������������
                {                    
                    clearInterval(timer);
                    console.log("TimeFail");
                    console.log(turn);
                    HPloss(turn);
                    if (turn===1)
                        turn++;
                    else turn--;
                    console.log(turn);
                    if (arrayCities.length<5) SetTimer(15);
                    else if (arrayCities.length<10) SetTimer(30);
                    else SetTimer(55);
                }
            }, 1000);
}

    function gameOver(p){
        $("#popup, #popup_overlay").fadeIn();

        //$("#popup").load("popup_gameover1.html");

        //$("#popup").text("�?грок "+p+ " проиграл");
    }

});


// При нажатии на enter стирать введеный текст
// картинки с яндекса требуют капчу


// задача Саши:

// Сделать отдельную функцию под таймер
// id="timer" - элемент в HTML куда надо будет передавать значение таймера
// таймер запускается после того как введется первое слово и обновляется после каждого верно введенного слова, по достижению 0 сек. останавливать 
