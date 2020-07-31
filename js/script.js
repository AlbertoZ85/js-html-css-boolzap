$(document).ready(function() {
    // ! 1. Reset del campo input e riposizionamento scrollbar dei contatti
    $('input').val('');
    $('#contacts-section').animate({scrollTop: 0},0);

    // ! 2. Al click su un contatto a sx lo evidenzio e visualizzo la chat a esso associata, con aggiornamento del nome del contatto e dell'orario di ultimo accesso
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
});

// ! *** VARIABILI GLOBALI ***
var thisChat;
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
        // Memorizzo l'indice della chat in cui invierò il messaggio (per evitare che, cliccando su un'altra chat prima della ricezione del messaggio, questo venga spedito alla chat 'active' appena selezionata)
        thisChat = $('.history-chat.active').index();
        // Invoco la funzione 'invia' per generare un messaggio 'sent' e cambio la visualizzazione del tasto 'send' con 'mic'
        invia(testo,'sent');
        $('#send-btn,#mic-btn').toggle();
        // Dopo 1 secondo la invoco nuovamente (con gli argomenti specifici per generare un messaggio 'received')
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
    var orario = addZero(data.getHours()) + ':' + addZero(data.getMinutes());
    // Incollo messaggio e orario al clone
    copia.find('.message-text').append(messaggio); // al posto di find posso usare children ma in un'ottica di programma scalabile è meglio find
    copia.find('.message-time').append(orario);
    // Attribuzione della specifica classe in base alla natura del messaggio
    if (classe == 'sent') {
        copia.addClass('sent');
    } else {
        copia.addClass('received');
    }
    // Incollo il clone al DOM
    var originalChat = $('.history-chat').eq(thisChat);
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

// $(document).ready(function() {
//     $("button").click(function() {
//         $(document).scrollTop($(document).height());
//     });
// });
