jQuery(document).ready(function($) {
    var gorod, population,tempString;
    var ErrorStatus = false;
    var arrayCities = [];


    function myClick(){
        ErrorStatus=false;
        console.log("Button Clicked");

        var input = $("#input").val();

        
        $.get("https://cors-anywhere.herokuapp.com/https://ru.wikipedia.org/wiki/"+input+"", function(data) {
            
            
            const htmlString = data;
            const parser = new DOMParser();
            const document = parser.parseFromString(htmlString, 'text/html');
            
            var rows = document.querySelectorAll('.no-wikidata[data-wikidata-property-id=P1082] .nowrap');
            try{
                tempString = rows[0].innerText;
            }
            catch(err){
                console.log("Попытка номер 2");
                rows = document.querySelectorAll("td > ul > li > span.wikidata-snak.wikidata-main-snak");
            }
            try{
                tempString = rows[0].innerText;
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

                population=parseInt(population);
                console.log(population);
            }
            catch(err){
                //console.log("Попытка номер 2");
                console.log("Страница не про город");
                //console.log(tempString);
                Error("Такой город нам неизвестен!");
               //32
            }
        }).done(function() {
                if(!ErrorStatus){
                    checkCity(input);
                }
            })
            .fail(function() {
            console.log("404 страницы нема");
            //console.log(tempString);
            Error("Такой город нам неизвестен!");
            });

    }


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
        if (arrayCities.length == 0){
            arrayCities.push(city);
            console.log(arrayCities);
            $("#first").text(city);
            $(".card-title").text(city);
            $(".card-text").text("Население: "+population+" чел.");
        }
        else if(arrayCities.indexOf(city)==-1){
            var firstChar = city[0];
            var prev = arrayCities[arrayCities.length-1];
            var prev2 = arrayCities[arrayCities.length-2];
            var prev_lastChar = prev[prev.length -1];
            if(firstChar == prev_lastChar){
                arrayCities.push(city);
                console.log(arrayCities);
                $("#first").text(city);
                $("#second").text(prev);
                $("#third").text(prev2);
                $(".card-title").text(city);
                $(".card-text").text(population);
            }
            else    
                Error("Город должен начинаться с буквы "+prev_lastChar);
        }
        else
            Error("Такой город уже называли!")
    }







});


// При нажатии на enter убирать выделение c поля ввода
// Проверка на последнюю букву: если "ь" то брать предыдущую
// Картинка берется с wiki
// Название города toLower / upper case
