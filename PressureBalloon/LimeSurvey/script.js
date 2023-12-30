// pressure version of the BART

$(document).ready(function() { 
    console.log("coucou");
    
    const saveThis = 'hidden'; // text fields that save data should not be shown; can be shown in testing
    
    // initialize values
    
    
    let round = 0;
    let size; // start_size incremented by 'increase'
    let pumps; 
    let total = 0; // money that has been earned in total
    let pumpmeup; // number pumps in a given round
    const rounds_to_play = 10;
    const maximal_pumps = 30;
    const number_pumps = []; // arrays for saving number of pumps
    const exploded = []; // array for saving whether ballon has exploded
    const start_size = 150; // start value of widht & height of the image; must correspond to the value that is specified for the #ballon id in style.css
    const increase = 8; // number of pixels by which balloon is increased each pump
    const language = "EN";
    const res = [];
    let time;
    let timers = [];
    
    let label_press;
    let label_collect;
    let label_balance;
    let label_currency;
    let label_header;
    let label_gonext1;
    let label_gonext2;
    let msg_1;
    let msg_explosion2;
    let msg_explosion3;
    let msg_collect2;
    let msg_collect3;
    let msg_collect4;
    let msg_end1;
    let msg_end2;
    let not_push;

    // initialize language
    if (language === "DE") {
        label_press = 'Druck in der Zuleitung erhöhen';
        label_collect = 'Ballon mit Luft aus Zuleitung aufpumpen';
        label_balance = 'Gesamtguthaben:';
        label_currency = ' Taler';
        label_header = 'Ballon-Spiel Runde ';
        label_gonext1 = 'Nächste Runde starten';
        label_gonext2 = 'Spiel beenden';
        msg_1 = '<p>Sie haben in dieser Runde ';
        msg_explosion2 = ' Mal den Druck erhöht. Der Ballon ist jedoch schon nach ';
        msg_explosion3 = ' Druckerhöhungen geplatzt!</p><p>Sie haben in dieser Runde kein Geld verdient.</p>';
        msg_collect2 = ' Mal den Druck erhöht, ohne dass der Ballon explodiert ist. Der Ballon wäre in dieser Runde erst nach '
        msg_collect3 = ' Druckerhöhungen geplatzt.</p><p>Sie haben ';
        msg_collect4 = ' Taler Gewinn gemacht. Das erspielte Geld ist sicher in der Bank.</p>';
        msg_end1 = '<p>Damit ist dieser Teil der Studie abgeschlossen. Sie haben im Ballon-Spiel ';
        msg_end2 = ' Taler Gewinn gemacht. </p><p>Klicken Sie auf <i>Weiter</i>, um mit der Studie forzufahren.</p>';
        not_push = 'In der Zuleitung befindet sich noch keine Luft. Sie können den Ballon erst aufpumpen, sobald Sie mindestens einmal Luft in die Zuleitung gepumpt haben. Betätigen Sie dazu den Button "Druck in der Zuleitung erhöhen."';
    }

    if (language === "EN") {
        label_press = 'Druck in der Zuleitung erhöhen';
        label_collect = 'Ballon mit Luft aus Zuleitung aufpumpen';
        label_balance = 'Gesamtguthaben:';
        label_currency = ' Taler';
        label_header = 'Ballon-Spiel Runde ';
        label_gonext1 = 'Nächste Runde starten';
        label_gonext2 = 'Spiel beenden';
        msg_1 = '<p>Sie haben in dieser Runde ';
        msg_explosion2 = ' Mal den Druck erhöht. Der Ballon ist jedoch schon nach ';
        msg_explosion3 = ' Druckerhöhungen geplatzt!</p><p>Sie haben in dieser Runde kein Geld verdient.</p>';
        msg_collect2 = ' Mal den Druck erhöht, ohne dass der Ballon explodiert ist. Der Ballon wäre in dieser Runde erst nach '
        msg_collect3 = ' Druckerhöhungen geplatzt.</p><p>Sie haben ';
        msg_collect4 = ' Taler Gewinn gemacht. Das erspielte Geld ist sicher in der Bank.</p>';
        msg_end1 = '<p>Damit ist dieser Teil der Studie abgeschlossen. Sie haben im Ballon-Spiel ';
        msg_end2 = ' Taler Gewinn gemacht. </p><p>Klicken Sie auf <i>Weiter</i>, um mit der Studie forzufahren.</p>';
        not_push = 'In der Zuleitung befindet sich noch keine Luft. Sie können den Ballon erst aufpumpen, sobald Sie mindestens einmal Luft in die Zuleitung gepumpt haben. Betätigen Sie dazu den Button "Druck in der Zuleitung erhöhen."';
    }

    if (language === "FR") {
        label_press = 'Druck in der Zuleitung erhöhen';
        label_collect = 'Ballon mit Luft aus Zuleitung aufpumpen';
        label_balance = 'Gesamtguthaben:';
        label_currency = ' Taler';
        label_header = 'Ballon-Spiel Runde ';
        label_gonext1 = 'Nächste Runde starten';
        label_gonext2 = 'Spiel beenden';
        msg_1 = '<p>Sie haben in dieser Runde ';
        msg_explosion2 = ' Mal den Druck erhöht. Der Ballon ist jedoch schon nach ';
        msg_explosion3 = ' Druckerhöhungen geplatzt!</p><p>Sie haben in dieser Runde kein Geld verdient.</p>';
        msg_collect2 = ' Mal den Druck erhöht, ohne dass der Ballon explodiert ist. Der Ballon wäre in dieser Runde erst nach '
        msg_collect3 = ' Druckerhöhungen geplatzt.</p><p>Sie haben ';
        msg_collect4 = ' Taler Gewinn gemacht. Das erspielte Geld ist sicher in der Bank.</p>';
        msg_end1 = '<p>Damit ist dieser Teil der Studie abgeschlossen. Sie haben im Ballon-Spiel ';
        msg_end2 = ' Taler Gewinn gemacht. </p><p>Klicken Sie auf <i>Weiter</i>, um mit der Studie forzufahren.</p>';
        not_push = 'In der Zuleitung befindet sich noch keine Luft. Sie können den Ballon erst aufpumpen, sobald Sie mindestens einmal Luft in die Zuleitung gepumpt haben. Betätigen Sie dazu den Button "Druck in der Zuleitung erhöhen."';
    }
    
    
    
    // initialize labels
    $('#press').html(label_press); 
    $('#collect').html(label_collect);
    $('#total_term').html(label_balance);
    $('#total_value').html(total+label_currency);

    // create the explode array random

    // Normal distribution random
    const randn_bm = function() {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        let num = Math.sqrt( -5.0 * Math.log( u ) ) * Math.cos( 5.0 * Math.PI * v );
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
        return num
    };

    const explode_array = [];
    for ( let i = 0; i < rounds_to_play; i++) {
        explode_array.push(Math.floor(randn_bm() * 30) + 1)
    }
    console.log(explode_array)
   // below: create functions that define game functionality
    
    // what happens when a new round starts
    const new_round = function() {
        $('#gonext').hide();
        $('#message').hide();  
        $('#collect').show();
        $('#press').show();
        round += 1;
        size = start_size;
        pumps = 0;
        //  console.log(explode_array[round-1]);
        $('#ballon').width(size); 
        $('#ballon').height(size);
        $('#ballon').show();
        $('#round').html('<h2>'+label_header+round+'<h2>');
        time = new Date().getTime();
    };
    
    // what happens when the game ends
    const end_game = function() {
        $('#sliderwrap').remove();
        $('#total').remove();
        $('#collect').remove();
        $('#ballon').remove();
        $('#press').remove();
        $('#gonext').remove();
        $('#round').remove();
        $('#message').html(msg_end1+total+msg_end2).show();
    };
    
    // message shown if balloon explodes
    const explosion_message = function() {
        $('#collect').hide();
        $('#press').hide();
        $('#message').html(msg_1+pumpmeup+msg_explosion2+explode_array[round-1]+msg_explosion3).show();
    };
    
    // message shown if balloon does not explode
    const collected_message = function() {
        $('#collect').hide();
        $('#press').hide();    
        $('#message').html(msg_1+pumpmeup+msg_collect2+explode_array[round-1]+msg_collect3+pumpmeup+msg_collect4).show();
        // activate this if you have a sound file to play a sound
        // when the balloon does not explode:
    };
    
    // animate explosion using jQuery UI explosion
    const balloon_explode = function() {
        $('#ballon').hide();
    };
    
    // show button that starts next round
    const gonext_message = function() {
        $('#ballon').hide();
        if (round < rounds_to_play) {
            $('#gonext').html(label_gonext1).show();
        }
        else {
            $('#gonext').html(label_gonext2).show();
        }
    };
    
    // add money to bank
    var increase_value = function() {
        $('#total_value').html(total+label_currency);
    };
    
    
    // button functionalities
    
    // pump button functionality -> 'pressure' in slider bar increases
    $('#press').click(function() {
        if (pumps >= 0 && pumps < maximal_pumps) { // interacts with the collect function, which sets pumps to -1, making the button temporarily unclickable
            timers.push(new Date().getTime() - time);
            pumps += 1;
            $("#slider" ).slider( "option", "value", pumps );
            time = new Date().getTime();
        }
    });
    
    // click this button to start the next round (or end game when all rounds are played)
    $('#gonext').click(function() {
        if (round < rounds_to_play) {
            new_round();
        }
        else {
            end_game();
        }
    });
     
      // collect button: release pressure and hope for money
    $('#collect').click(function() {
        if (pumps === 0) {
	        alert(not_push);
        }
        else if (pumps > 0) { // only works after at least one pump has been made
            timers.push(new Date().getTime() - time);
	        let explosion = 0; // is set to one if pumping goes beyond explosion point; see below
	        number_pumps.push(pumps); // save number of pumps
	        pumpmeup = pumps;
	        pumps = -1; // makes pumping button unclickable until new round starts
	        for (var i = 0; i < pumpmeup; i++) {
	            size += increase;
	            if (i === explode_array[round-1]-1) { // -> insert explosion criterion here
	                explosion = 1; 
	                break; // break loop when explosion point is reached; balloon will not get pumped any further!
	            }
	        }
	        //determine animation speed; faster for smaller balloons
            let animate_speed;
            if (i < 4) {
	            animate_speed = 200;
            } else if (i < 7) {
	            animate_speed = 300;
	        } else if (i < 12) {
	            animate_speed = 400;
	        } else if (i < 17) {
	            animate_speed = 500;
            } else if (i < 22) {
	            animate_speed = 600;
	        } else if (i < 27) {
	            animate_speed = 700;
	        } else { 
	            animate_speed = 800; 
	        }
	        // animates slider value to 0
            $('#slider').slider('value', 0);
	        // balloon gets pumped using jQuery animation
	        $('#ballon').animate({
	            width: size+'px',
	            height: size+'px',
	        }, animate_speed);
	        // handle explosion
	        if (explosion === 1) {
	            setTimeout(balloon_explode, animate_speed);
	            setTimeout(explosion_message, animate_speed+1400);
	            setTimeout(gonext_message, animate_speed+1400);
	        }
	        // handle no explosion
	        else {
	            total += pumpmeup;
	            setTimeout(collected_message, animate_speed+1000);
	            setTimeout(increase_value, animate_speed+1000);
	            setTimeout(gonext_message, animate_speed+1000);
	        }
            let rounds = new Object();
            rounds.rounds = round;
            rounds.exploded = explosion;
            rounds.number_pumps= i;
            rounds.timers = timers;
            timers = [];
            res.push(rounds)
            $("#answer477133X3X6").val(JSON.stringify(res));

        }
    });
    
    
    // initialize slider that handles the pumps
    
    $( "#slider" ).slider( {
        orientation: "vertical",
        value: 0,
        min: 0,
        max: 32,
        disabled: true,
        animate: true,
        create: function( event, ui ) {
            var v=$(this).slider('value');
            $(this).find('.ui-slider-handle').text(v);
        },
        change: function( event, ui ) {
            $(this).find('.ui-slider-handle').text(ui.value);
        },
        range: "min",
    });
    
    
    // start the game!
    new_round();
    
    console.log("bis bald")
});
