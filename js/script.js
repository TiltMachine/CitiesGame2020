jQuery(document).ready(function($) {
    var population,tempString;
    var imgSrc;
    var turn = 1, p1score = 0, p2score = 0, p1hp = 3, p2hp = 3;
    var ErrorStatus = false;
    var arrayCities = [];
    var timer=undefined;
    var state_gameover = false;
    var difficulty = 0;
    var points=30000000;


    function setDifficulty(){
        if(difficulty==1){
            p1hp = 1;
            p2hp = 1; 
            $("#p1_HP3, #p2_HP3, #p1_HP2, #p2_HP2").hide();
        }
        else{
            p1hp = 3;
            p2hp = 3;
            $("#p1_HP3, #p2_HP3, #p1_HP2, #p2_HP2").show(); 
        }    
    }    

    function myClick(){

        

        ErrorStatus=false;
        //console.log("Button Clicked");

        var input = $("#input").val();
        input = clear(input);

        $(".spinner-border").show();
        clearInterval(timer);
        //https://cors-anywhere.herokuapp.com/
        $.get("https://cors-anywhere.herokuapp.com/https://geo.koltyrin.ru/goroda_poisk.php?city="+input+"", function(data) {
            
            
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
            $(".spinner-border").hide();
            var url = "https://yandex.ru/images/search?text=город%20"+input;
            //var url = "https://duckduckgo.com/?q=город+"+input+"&=h_&iar=images&iax=images&ia=images";
            //console.log("in: "+ url);
            $.get(url, function(d) {
                    const htmlString = d;
                    //console.log(htmlString);
                    const parser = new DOMParser();
                    var document = parser.parseFromString(htmlString, 'text/html');
                    var pics = document.querySelectorAll("div > a > img");
                    //var pics = document.querySelectorAll("#zci-images > div > div.tile-wrap > div > div:nth-child(3) > div.tile--img__media > span > img");
                    //console.log(pics);
                    imgSrc = "https:"+$(pics[0]).attr("src");
                    
                    //console.log(imgSrc);
                }).done(function() {

                    if(!ErrorStatus){
                        checkCity(input);
                    }


                });

                
            })
            .fail(function() {
            $(".spinner-border").hide();
            console.log("ERROR: 404 страницы не существует!");
            Error("Такой город нам неизвестен!");
            });

    }
    

    $(".input-group").click(function(){
        console.log(state_gameover,p1score,arrayCities);

        if(state_gameover){
            
            console.log("vse");
        }
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
            $("#input").val("");
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
                $("#input").val("");
                arrayCities.push(city);
                console.log(arrayCities);
                
                clearInterval(timer);
                if (arrayCities.length<5)
                    SetTimer(15);
                else if (arrayCities.length<10)
                    SetTimer(30);
                else 
                    SetTimer(45);

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
        $(".card-text").text("Население: "+beautifulNum(population)+" чел.");
        $("#wikiLink").attr("href","https://ru.wikipedia.org/wiki/"+city+"");
    }

    function AddScore(player){
        $("#p"+player+"_score_add").text("+"+population);

        //$("#p"+player+"_score_add").css({opacity: 1});
        $("#p"+player+"_score_add").fadeTo('fast',1);
        //$("#p1_score_add").show('slow');
        //$("#p2_score_add").show('slow');

        setTimeout(function () {
            $("#p"+player+"_score_add").fadeTo('fast',0);
        }, 1500);

        setTimeout(function(){
            $("#p"+player+"_score_add").text("+1337");
        },1800)

        if(player == 1){
            p1score+= population;
            
            $("#p1_score").text(beautifulNum(p1score));
            //$("#p1_score_add").show('slow');
            turn++;
            if (p1score>=points) gameOver(1);
        }
        else{
            p2score+= population;
            $("#p2_score").text(beautifulNum(p2score));
            turn--;
            if (p2score>=points) gameOver(2);
        }
        $("#player_turn").text("Ход игрока "+turn);
    }

    function HPloss(p){
        

        if (p==1){
            $("#p1_HP"+p1hp).replaceWith("<svg id='p1_HP"+p1hp+"' class='bi bi-heart' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z'/></svg>");
            p1hp--;
            if(p1hp==0){
                gameOver(2);
            }
        }
        else{
            $("#p2_HP"+p2hp).replaceWith("<svg id='p2_HP"+p2hp+"' class='bi bi-heart' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z'/></svg>");
            p2hp--;
            if(p2hp==0){
                gameOver(1);
            }
        }
    }

    function clear(name){ // удаляет лишние пробелы, обрабатывает города с дефисом
        var str=name.split("");
        var newstr="";
        while(str[0].charCodeAt()===32)
            str.splice(0,1);
        while(str[str.length-1].charCodeAt()===32)
            str.splice(str.length-1,1);
        //console.log(str);
        for(i=0;i<str.length;i++){
            if(str[i]==='-')
                str[i+1]=str[i+1].toUpperCase();
            newstr+=str[i];
        }
        return newstr;
    }

    function SetTimer(time){
        timer=setInterval(function() {
            if (time>9)
                $('#timer').text(":"+time+"");
            else
                $('#timer').text(":0"+time+"");
            if (time>0) 
                time--; 
            else{                    
                clearInterval(timer);
                console.log("TimeFail");
                //console.log("Сейчас ход был ход игрока: "+turn);
                HPloss(turn);
                if (turn===1)
                    turn++;
                else
                    turn--;
                $("#player_turn").text("Ход игрока "+turn);
                //console.log(turn);
                if(!state_gameover){
                    if (arrayCities.length<5)
                        SetTimer(15);
                    else if (arrayCities.length<10)
                        SetTimer(30);
                    else
                        SetTimer(45);
                }
            }
        }, 1000);
    }

    $("#settings_icon").click(function(){
        settingsMenuOpen();
    });

    function settingsMenuOpen(){
        
        console.log(state_gameover,p1score,arrayCities);
        $("#popup, #popup_overlay").fadeIn();
        $("#popup").load("settings.html", function(){

            if (difficulty==1)
                $("#hardcore").attr("checked", "checked");
            
            $("#go_back_button").click(function () {
                $("#popup, #popup_overlay").fadeOut();
            });
            
            $("#save_button").click(function () {
                if ($("#hardcore").prop("checked")==true)
                    difficulty = 1;
                else
                    difficulty = 0;

                setDifficulty();
                
                if($("#inputset").val()!=="") 
                    points=$("#inputset").val();
                
                $("#goal").text("Цель: "+beautifulNum(points));
            
            });

            $("#restart_button").click(function () {
                restartGame();
            });
        
           
        });
    }

    $("#popup_overlay").click(function () {
        console.log(difficulty);
        $("#popup, #popup_overlay").fadeOut();
    });

    
    
    function gameOver(p){
        state_gameover = true;
        clearInterval(timer);
        console.log("GAMEOVER");

        $("#input").attr("readonly","readonly");
        $("#input").val("");
        $("#input").attr("placeholder","Игра окончена!");
        $("#popup, #popup_overlay").fadeIn();       
        $("#popup").load("js/popup_gameover1.html", function(){
                $("#winner_t").text("Победа Игрока "+p);
                $("#retry").click(function(){
                    restartGame();
                });
                $("#goto_settings").click(function(){
                    settingsMenuOpen();
                });
        });
    }

    function restartGame(){
        for(var i=1;i<=3;i++){
            $("#p1_HP"+i).replaceWith("<svg id='p1_HP"+i+"' class='bi bi-heart-fill' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z'/></svg>");
            $("#p2_HP"+i).replaceWith("<svg id='p2_HP"+i+"' class='bi bi-heart-fill' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z'/></svg>");
        }
        state_gameover = false;
        $("#input").removeAttr("readonly");
        $("#input").val("");
        $("#input").attr("placeholder","Город");
        $("#p1_score").text("0");
        $("#p2_score").text("0");
        $('#timer').text(":15");
        $('.input-group-text').text("");
        $('#first, #second, #third').text("");
        $('.card-title').text("Название города");
        $('.card-text').text("Информация о городе");
        $('#wikiLink').attr("href","#");
        $(".card img").attr("src","img/q.png");
        $("#player_turn").text("Ход игрока 1");
        setDifficulty();
        p1score = 0;
        p2score = 0;
        arrayCities = [];
        turn = 1;
        clearInterval(timer);
        console.log(state_gameover,p1score,arrayCities);
    }

    function beautifulNum(num){
       return num.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
    }

});

/*

картинки с яндекса требуют капчу

// сценарий показа сайта
// переход хода к другому
//анимация загруки
*/