jQuery(document).ready(function($) {
    var gorod, population,tempString;
    var imgSrc, cardHREF;
    var ErrorStatus = false;
    var arrayCities = [];


    function myClick(){
        ErrorStatus=false;
        console.log("Button Clicked");

        var input = $("#input").val();

        
        $.get("https://geo.koltyrin.ru/goroda_poisk.php?city="+input+"", function(data) {
            
            
            const htmlString = data;
            const parser = new DOMParser();
            var document = parser.parseFromString(htmlString, 'text/html');
            
            //var rows = document.querySelectorAll('.no-wikidata[data-wikidata-property-id=P1082] .nowrap');
            var rows = document.querySelector("body > div.global > div > div.field_center > div:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(2)");

            /*try{
                tempString = rows.innerText;
            }
            catch(err){
                console.log("Этого города нет в базе данных");
                //rows = document.querySelectorAll("td > ul > li > span.wikidata-snak.wikidata-main-snak");
            }*/
            try{
                tempString = rows.innerText;
                console.log(rows.innerText);
                

                


                // console.log(tempString); // --- tempString это строка населения с википедии
                var mas=tempString.split("");
                
                //console.log(mas);
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
                //console.log("3");
                population=parseInt(population);
                console.log(population);
                //console.log("4");
                

               // console.log("imgSRC: "+imgSrc);
            }
            catch(err){
                console.log("Этого города нет в базе данных");
                Error("Такой город нам неизвестен!");
            }
        }).done(function() {

            $.get("https://yandex.ru/images/search?text=город%20"+input+"", function(d) {
                    const htmlString = d;
                    const parser = new DOMParser();
                    var document = parser.parseFromString(htmlString, 'text/html');
                    var pics = document.querySelectorAll("div > a > img");
                    console.log(pics[0]);
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
            //console.log(tempString);
            Error("Такой город нам неизвестен!");
            });

    }

    //$(".card").click(function(){
    //    $("#wikiLink").attr("href","https://ru.wikipedia.org/wiki/");
    //});


    //*[@id="mw-content-text"]/div/table[1]/tbody/tr[20]/td/span/span
    

    
    $("#enter").click(function(){
        myClick()
    });
    $("#input").keypress(function(event) {
        if (event.keyCode == 13)
            myClick();
    });
    

    function Error(message){
        ErrorStatus = true;
        
        $(".alert-danger").text(message);
        $(".alert-danger").show('350');
    
        setTimeout(function () {
            $(".alert-danger").hide('350');
        }, 4000);
    }

    function checkCity(city){
        city = city.toLowerCase();
       
        if (arrayCities.length == 0){

            arrayCities.push(city);

            console.log(arrayCities);

            forFirstChar(city);
            Card(city);
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
            console.log(prev_lastChar);
            if(firstChar == prev_lastChar || firstCharCapital == prev_lastCharCapital){
                arrayCities.push(city);
                console.log(arrayCities);
                
                forFirstChar(city);
                Card(city);

                $("#second").text(firstLetter(prev));
                try{
                $("#third").text(firstLetter(prev2));
                }
                catch{
                }

                /*$.getJSON("js/db.json", function( data ) {
                    console.log(data.populations[1]);
                    data.cities.push(city);
                    data.populations.push(population);
                    console.log(data);
                  }); */
            }
            else    
                Error("Город должен начинаться с буквы "+prev_lastCharCapital);
        }
        else
            Error("Такой город уже называли!")
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
        $(".card img").attr("src",imgSrc);
        $(".card-title").text(firstLetter(city));
        $(".card-text").text("Население: "+population+" чел.");
        $("#wikiLink").attr("href","https://ru.wikipedia.org/wiki/"+city+"");
    }




});


// При нажатии на enter убирать выделение c поля ввода
// Проверка на последнюю букву: если "ь" то брать предыдущую
// города типа Нью-Йорк йорк пишется с маленькой буквы
// города канады идут по пизде + Токио + города у которых много значений
// в википедии первая картинка может быть не городом
// удалять лишние пробелы

// вадуц - население
// новгород - картинка