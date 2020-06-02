jQuery(document).ready(function($) {

    $("#enter").click(function(){

        console.log("Button Clicked");

        var input = $("#input").val();



        //Error();
        
        


        
        $.get("https://cors-anywhere.herokuapp.com/https://ru.wikipedia.org/wiki/"+input+"", function(data) {
           console.log(data);
           
        });

        //$(".no-wikidata[data-wikidata-property-id=P1082] .nowrap").text()
    });

    
    $(document).keypress(function(event) {
        if (event.keyCode == 13) {
            $(".alert-danger").hide('350');    
        // console.log('You pressed a "enter" key in textbox, here submit your form'); 
        }
    });

    function Error(){
        $(".alert-danger").show('350');
    }







});


// При нажатии на enter отправлять слово.
// Проверка на последнюю букву: чтобы не "ь"