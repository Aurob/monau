
var url = 'https://api.openweathermap.org/data/2.5/weather?q=';
var key = '&appid=270f40e9a3a6e4b1865a9c30d28618c5';

var p = document.getElementById("info");

var form = document.getElementsByTagName("form")[0];
form.addEventListener('submit', (event)=>{
    event.preventDefault();

    const xhr = new XMLHttpRequest(); // xhr object
    xhr.open('get', url + form.cityName.value + key, true);

    // send request
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) { // 4 means request is completed
        // response from server, check if response is 200
            switch (xhr.status) {
            case 200:
            case 304: 
                console.log("OK or Not Modified (cached)", xhr.status);
                p.innerHTML = xhr.response;
                break;
            case 201:
                console.log("Created", xhr.status);
                break;
            case 403:
                console.log("Not Authorized", xhr.status);
                break;
            case 404:
                console.log("Not Found", xhr.status);
            case 500:
                console.log("Server Side Error", xhr.status);
                break;
            default:
                console.log("Some other code: ", xhr.status, xhr.status);       
            }
        }
        
        // if the request was failed
        xhr.onerror = function() {
        console.warn();
        //alert(`Network Error`);
        }
    
    };

});

   

