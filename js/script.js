$(document).ready(function() {
    // ! 1. Reset del campo input
    $('input').val('');

    // ! 2. Al click su un contatto a sx lo evidenzio e visualizzo la chat a esso associata, con aggiornamento di immagine e nome del contatto e dell'orario di ultimo accesso
    $('.contact-box').click(function() {
        $('#wa-start').hide();
        $('#chat').show();
        $('.active').removeClass('active');
        $(this).addClass('active');
        $('.history-chat').eq($(this).index()).addClass('active');
        $('.recipient img').attr('src',$(this).find('img').attr('src'));
        $('.recipient-details .contact-name').text($(this).find('.contact-name').text());
        $('.recipient-details .last-seen span').text($(this).find('.last-time').text());
        // $('.history-chat.active').animate({scrollTop: $('.history-chat.active').prop('scrollHeight')},0);
    });

    // ! 3. A qualsiasi input dell'utente metto in attesa il programma, che fa visualizzare il tasto 'send' solo quando vi è un contenuto (spazi bianchi compresi), altrimenti mostra il tasto 'mic'
    $('#text-input').on('input',function() {
        if ($(this).val()) {
            $('#send-btn').show();
            $('#mic-btn').hide();
        } else {
            $('#send-btn').hide();
            $('#mic-btn').show();
        }
    });

    // ! 4. Premendo 'invio' invoco la funzione 'chat'
    $('#text-input').keydown(function() {
        if (event.which == 13) {
            chat();
        }
    });

    // ! 5. Cliccando sul tasto 'send' invoco la funzione 'chat'
    $('#send-btn').on('click',chat);

    // ! 6. Digitando nella barra di ricerca una stringa di caratteri, visualizzo i contatti il cui nome contiene tale stringa
    $('#search-input').keyup(function() {
        searchContact();
    });
});

// ! *** VARIABILI GLOBALI ***
var frasiRandom = [
    'Ciao!',
    'Ehi! Dimmi',
    'Bonjour',
    'No dai...',
    'Che ti posso dire... sono pienamente d\'accordo. Tu sì che sai eh?!',
    'Questo messaggio non ha alcun senso, è volutamente ideato affinché la sua lunghezza attivi il controllo sul troncamento dell\'anteprima nei contatti a sinistra'
];

// *** FUNZIONI *** //
// a. Stampa sul DOM dei messaggi
function chat() {
    var testo = $('#text-input').val();
    // La funzione si applica soltanto se sono stati digitati dei caratteri
    if (testo.trim()) {
        $('#text-input').val('');
        // Memorizzo l'indice della chat in cui invierò il messaggio (per evitare che, cliccando su un'altra chat prima della ricezione del messaggio, questo venga spedito alla chat 'active' appena selezionata)
        var thisChat = $('.history-chat.active').index();
        // Invoco la funzione 'invia' per generare un messaggio 'sent' e cambio la visualizzazione del tasto 'send' con 'mic'
        invia(testo,'sent',thisChat);
        $('#send-btn,#mic-btn').toggle();
        // Sposto in cima alla lista il contatto corrente
        $('.contact-box').eq(thisChat).prependTo('#contacts-section');
        // Dopo aver spostato in cima la chat corrispondente, invoco nuovamente la funzione 'invia' dopo 1 secondo (con gli argomenti specifici per generare un messaggio 'received')
        $('.history-chat').eq(thisChat).prependTo('#main');
        $('.last-seen').text('sta scrivendo...');
        setTimeout(invia,1000,frasiRandom[numRandom(0,frasiRandom.length - 1)],'received',0);
    }
}

// b. Gestione della generazione dei messaggi col metodo .clone() e dell'orario corrente, con successivo aggiornamento della scrollbar
function invia(messaggio,classe,indiceCorrente) {
    // Clonazione del template
    var copia = $('.template .message').clone();
    // Generazione orario corrente
    var data = new Date();
    var orario = addZero(data.getHours()) + ':' + addZero(data.getMinutes());
    // Incollo messaggio e orario al clone
    copia.find('.message-text').append(messaggio); // al posto di find posso usare children ma in un'ottica di programma scalabile è meglio find
    copia.find('.message-time').append(orario);
    // Attribuzione della specifica classe in base alla natura del messaggio
    if (classe == 'sent') {
        copia.addClass('sent');
        // Aggiornamento di anteprima messaggio e orario nella lista contatti
        $('.contact-box').eq(indiceCorrente).find('.contact-message').text(messaggio);
        $('.contact-box').eq(indiceCorrente).find('.last-time').text(orario);
    } else {
        copia.addClass('received');
        // Controllo per il troncamento dei messaggi eccedenti un certo numero di caratteri e aggiornamento ultimi accessi
        if (messaggio.length > 40) {
            messaggio = messaggio.substring(0,40) + '...';
        }
        $('.contact-box').eq(0).find('.contact-message').text(messaggio);
        $('.contact-box').eq(0).find('.last-time').text(orario);
        $('.last-seen').text(`ultimo accesso oggi alle ${orario}`);
    }
    // Incollo il clone al DOM
    var originalChat = $('.history-chat').eq(indiceCorrente);
    originalChat.append(copia);
    // Aggiornamento scrollbar (col metodo prop() di jQuery 1.6)
    $(originalChat).animate({scrollTop: $(originalChat).prop('scrollHeight')},0);
    // $(originalChat).animate({scrollTop: $(originalChat)[0].scrollHeight},0) funziona, è di jQuery 1.5. $('#main').animate({scrollTop: $(copia).offset().top},0) non funzionava, metodo offset() è impreciso nel calcolo dell'altezza
}

// c. Aggiunta di un eventuale zero davanti a ore e minuti quando sono inferiori a 10
function addZero(num) {
    if (num < 10) {
        num = '0' + num;
    }
    return num;
}

// d. Generazione numeri random tra min e max compresi
function numRandom(min,max) {
    return Math.floor(Math.random()*(max - min + 1) + min);
}

// e. Ricerca di un contatto
function searchContact() {
    var filtrato = $('#search-input').val().toLowerCase();
    var contatti = $('.contact-box');

    for (var i = 0; i < contatti.length; i++) {
        var elemento = contatti.eq(i).find('.contact-name').text();
        if (elemento.toLowerCase().includes(filtrato)) {
            contatti.eq(i).show();
        } else {
            contatti.eq(i).hide();
        }
    }

    // Se non ci sono contatti corrispondenti, visualizzo apposito messaggio
    if ($('.contact-box:visible').length == 0) {
        $('#zero-found').show().text('Nessun contatto trovato');
    } else {
        $('#zero-found').hide();
    }
}

// $(document).ready(function() {
//     $("button").click(function() {
//         $(document).scrollTop($(document).height());
//     });
// });
