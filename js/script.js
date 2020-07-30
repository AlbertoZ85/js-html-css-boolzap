$(document).ready(function() {
    // 1. Reset del campo input
    $('input').val('');

    // 2. A qualsiasi input dell'utente metto in attesa il programma, che fa visualizzare il tasto 'send' solo quando vi è un contenuto (spazi bianchi compresi), altrimenti mostra il tasto 'mic'
    $('#text-input').on('input',function() {
        if ($(this).val()) {
            $('#send-btn').show();
            $('#mic-btn').hide();
        } else {
            $('#send-btn').hide();
            $('#mic-btn').show();
        }
    });

    // 3. Premendo 'invio' invoco la funzione 'chat'
    $('#text-input').keydown(function() {
        if (event.which == 13) {
            chat();
        }
    });

    // 4. Cliccando sul tasto 'send' invoco la funzione 'chat'
    $('#send-btn').on('click',chat);
});

// Variabili globali
var frasiRandom = [
    'Ciao!',
    'Ehi! Dimmi',
    'Bonjour',
    'No dai...',
    'Che ti posso dire... sono d\'accordo'
];

// *** FUNZIONI *** //
// a. Stampa sul DOM dei messaggi
function chat() {
    var testo = $('#text-input').val();
    // La funzione si applica soltanto se sono stati digitati dei caratteri
    if (testo.trim()) {
        $('#text-input').val('');
        // Invoco la funzione 'invia' per generare un messaggio inviato e cambio la visualizzazione del tasto 'send' con 'mic'
        invia(testo,'sent');
        $('#send-btn').hide();
        $('#mic-btn').show();
        // Dopo 1 secondo la invoco nuovamente (con gli argomenti specifici per generare un messaggio ricevuto)
        setTimeout(invia,1000,frasiRandom[numRandom(0,frasiRandom.length - 1)],'received');
        //
    }
}

// b. Gestione della generazione dei messaggi col metodo .clone() e dell'orario corrente, con successivo aggiornamento della scrollbar
function invia(messaggio,classe) {
    // Clonazione del template
    var copia = $('.template .message').clone();
    // Generazione orario corrente
    var data = new Date();
    var minCorrente = data.getMinutes();
    if (minCorrente < 10) {
        minCorrente = '0' + minCorrente;
    }
    var orario = data.getHours() + ':' + minCorrente;
    // Incollo messaggio e ora al clone
    copia.find('.message-text').append(messaggio); // al posto di find posso usare children ma in un'ottica di programma scalabile è meglio find
    copia.find('.message-time').append(orario);
    // Attribuzione della specifica classe in base alla natura del messaggio
    if (classe == 'sent') {
        copia.addClass('sent');
    } else {
        copia.addClass('received');
    }
    // Incollo il clone al DOM
    $('#main').append(copia);
    // Aggiornamento scrollbar
    $('#main').animate({scrollTop: $(copia).offset().top},0);
}

// c. Generazione numeri random tra min e max compresi
function numRandom(min,max) {
    return Math.floor(Math.random()*(max - min + 1) + min);
}

// $(document).ready(function() {
//     $("button").click(function() {
//         $(document).scrollTop($(document).height());
//     });
// });
