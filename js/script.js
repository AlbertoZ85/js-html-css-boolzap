$(document).ready(function() {
    $('input').val('');

    $('#text-input').keydown(function() {
        if (event.which == 13) {
            chat();
        }
    });
    $('#mic').on('click',chat);

    function chat() {
        var testo = $('#text-input').val();
        $('#text-input').val('');
        if (testo.trim().length > 0) {
            var copia = $('.template .message').clone();
            var data = new Date();
            var minCorrente = data.getMinutes();
            if (minCorrente < 10) {
                minCorrente = '0' + minCorrente;
            }
            var tempo = data.getHours() + ':' + minCorrente;
            copia.children('.message-text').append(testo);
            copia.children('.message-time').append(tempo);
            copia.addClass('sent');
            $('#main').append(copia);
            $('#main').animate({scrollTop: $(copia).offset().top},0);
            // c'è anche position() unito poi a scrollTop e top
            setTimeout(function() {
                var frasiRandom = [
                    'Ciao!',
                    'Ehi! Dimmi',
                    'Bonjour',
                    'No dai...',
                    'Che ti posso dire... sono d\'accordo'
                ];
                var copia = $('.template .message').clone();
                copia.children('.message-text').append(frasiRandom[numRandom(0,frasiRandom.length - 1)]);
                copia.children('.message-time').append(tempo);
                copia.addClass('received');
                $('#main').append(copia);
                $('#main').animate({scrollTop: $(copia).offset().top},0);
            },1000);
        }
    }
});

function numRandom(min,max) {
    return Math.floor(Math.random()*(max - min + 1) + min);
}

    // function rispRandom() {
    //     var frasiRandom = [
    //         'Ciao!',
    //         'Ehi! Dimmi',
    //         'Bonjour',
    //         'No dai...',
    //         'Che ti posso dire... sono d\'accordo'
    //     ];
    //     copia.children('.message-text').append(frasiRandom[numRandom(0,frasiRandom.length - 1)]);
    //     copia.children('.message-time').append(tempo);
    //     copia.addClass('received');
    //     $('#main').append(copia);
    // }


// $('#text-input').on('input',function() {
    //     $('#mic').hide();
    // });

// $(document).ready(function() {
//     $("button").click(function() {
//         $(document).scrollTop($(document).height());
//     });
// });
