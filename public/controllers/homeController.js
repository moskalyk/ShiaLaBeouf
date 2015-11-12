//angular
Mean.controller('homeController', function($scope, $http, $location, socket, $interval) {
    $http.post('/count')

    var quote = Math.floor(Math.random() * (25 - 0) + 0)
    $interval(function(){
        console.log(quote)
        $http.get('/quote/'+quote).success(function(data, status){
            console.log(data)
             var message = '<dd class="from">'
                      +'<p>'+data+' -shia</p>'
                    +'</dd>'

                $("#messages-chat").append(message)
        })
        var element = document.getElementById("messages");
        element.scrollTop = element.scrollHeight +50
        console.log(element.scrollHeight)
        quote++
        if(quote>=25)
            quote = 0;
    }, 10000)


    $http.get('/messages').success(function(data, status){
        if(data){
            for (var i = 0; i < data.length; i++) {
                
                var message = '<dd class="from">'
                      +'<p>'+data[i].message+'</p>'
                    +'</dd>'

                $("#messages-chat").append(message)
            };

        }else{

        }
    })
    socket.on("news", function(packet){
        console.log('on')
        $scope.somezing = packet.data;
        var message = '<dd class="from">'
              +'<p>'+packet.data+'</p>'
            +'</dd>'
        $("#messages-chat").append(message)
    });

    $scope.submitMessage = function() {
        var packet = {data: $('#textarea1').val()}

        $('#textarea1').val("")

        var message = '<dd class="to">'
                      +'<p>'+packet.data+'</p>'
                        +'</dd>'

        $("#messages-chat").append(message)

        $http.post('/message', packet)

        socket.emit('news', packet, function(result){
            if(!result){
                console.log('Something went wrong')
            }
        })
    };
});