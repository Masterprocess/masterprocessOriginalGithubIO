// Now you can even win with Jade, which is kinda the point of the game.

$( document )
	.ready( function() {
		var rounds = 0; // is you winning? this will tell the computer if it is so.
		var attacks = 0; // Figures out AP for the char
		var baseAP = 8; // how powerful attacks are
		var opponentSelect = false; // keeps track of status of game (character select, opponent select, etc)
		var defender, player, characters, doubleh, hahn, jade, mei, nino, peyj;

		function character( name, img, hp, ap, counterAP ) {
			this.name = name;
			this.img = img;
			this.HP = hp;
			this.AP = ap;
			this.counterAP = counterAP;
		}// be able to get these items with relative ease

		function gameSetup() {
			doubleh = new character( "Double H", "assets/images/doubleh.jpg", 210, baseAP, 18 );
			hahn = new character( "Hahn", "assets/images/hahn.png", 180, baseAP, 15 );
			jade = new character( "Jade", "assets/images/jade.jpg", 170, baseAP, 5 );
			mei = new character( "Mei", "assets/images/mei.jpg", 200, baseAP, 17 );
			nino = new character( "Nino", "assets/images/nino.jpg", 230, baseAP, 18 );
			peyj = new character( "Pey'j", "assets/images/peyj.jpg", 180, baseAP, 10 );


			characters = [ doubleh, hahn, jade, mei, nino, peyj ]; // makes using characters easier

			placeCharacters();

		}

		function placeCharacters() {
			for ( i = 0; i < characters.length; i++ ) {
				var character = characters[ i ]; // no more jumping through hoops to find the character
				var charDiv = $( "<div class = 'character-init' data-name = '" + i + "'>" );
				var charImg = $( "<div class = 'img-div'>" );
				var charName = $( "<div class = 'char-name'>" );
				var charHP = $( "<div class = 'char-hp'>" );

				charImg.html( "<img class='char-img' src=" + character.img + ">" );
				charName.text( character.name );
				charHP.text( character.HP );
				charDiv.append( charImg )
					.append( charName )
					.append( charHP );
				$( "#characters-initial" )
					.append( charDiv );
			}
		}

        // phase for character select
		$( "#characters-initial" )
			.on( "click", ".character-init", function( event ) {
                $("#lertie").addClass("invisible")
				if ( rounds === 0 && !opponentSelect ) {
					// "this" is the element the user clicked on
					var playerIndex = $( this )
						.attr( "data-name" );
					player = characters[ playerIndex ];
					$( this )
						.appendTo( $( "#player-character" ) );
					$( this )
						.removeClass( "character-init" )
						.attr( "id", "player" );
					$( "#characters-initial" )
						.children( ".character-init" )
						.each( function() {
							// "this" is the current element in the loop
							$( this )
								.appendTo( $( "#opponents" ) );
							$( this )
								.removeClass( "character-init" )
								.addClass( "opponent" )
							$( "#characters-initial" )
								.hide();
							$( "#fight-row" )
								.show();
							$( "#opponents" )
								.show();
                            
                            // debugging purposes
							console.log( "You have selected " + player.name );
						} );

					opponentSelect = true;
					rounds++;
				}
			} );

        // function for opponent select. mathematically, if you choose jade and don't go from weak to strong, you're almost guaranteed
        // to lose
		$( "#opponents" )
			.on( "click", ".opponent", function( event ) {
				if ( opponentSelect ) {
					$( "#defender" )
						.remove();
					$( "#game-text" )
						.empty();
					var defenderKey = $( this )
						.attr( "data-name" );
					defender = characters[ defenderKey ];
					$( this )
						.appendTo( $( "#defender-div" ) );
					$( this )
						.removeClass( "opponent" )
						.attr( "id", "defender" );
                    
                    // debugging purposes
					console.log( "Your opponent is " + defender.name );

					opponentSelect = false;
					rounds++;
					$( '#attack' )
						.prop( 'disabled', false );

				}

			} );



        // player always attacks first- this prevents any kind of weird "draw" scenarios
		function playerAttack() {
			$( "#game-text" )
				.html( "You attacked " + defender.name + " for " + player.AP );
			defender.HP -= player.AP;
			$( "#defender .char-hp" )
				.text( defender.HP );
			player.AP += baseAP;
			if ( defender.HP <= 20 ) {
				$( '#defender .char-hp' )
					.css( 'background-color', '#b71c1c' );
			}
			checkForWin();

		}

        // defender always attacks second- this makes game logic simpler.
		function defenderAttack() {
			$( "#game-text" )
				.append( "<p>" + defender.name + " attacked you for " + defender.counterAP + "</p>" );
			player.HP -= defender.counterAP;
			$( "#player .char-hp" )
				.text( player.HP );
			if ( player.HP <= 20 ) {
				$( '#player .char-hp' )
					.css( 'background-color', '#b71c1c' );
			}

			checkForLose();
		}

        // function determines if you've won based on how many characters you've eliminated, then decides to either kick you
        // into the win screen or the opponent select screen
		function checkForWin() {
			if ( defender.HP <= 0 ) {
				$( '#attack' )
					.prop( 'disabled', true );
				if ( rounds === characters.length ) {
                    
					$( "#game-text" )
						.empty();
					$( "#game-text" )
						.html( "<h2>Way to go, agent! You can go again if you don't feel up to speed. Otherwise, go buy Beyond Good and Evil and start on the real work for IRIS!</h2>" );
					$( "#restart" )
						.show();
					$( "#opponents" )
						.hide();
					return true;

				} else {
					$( "#game-text" )
						.empty();
					$( "#game-text" )
						.html( "<h2>Great, you kicked " + defender.name + "'s ass!</h2>" )
					opponentSelect = true;
					return true;
				}

			}
			return false;
		}

        // self explanatory. if your health is less than or equal to one, you lose and gotta start over.
		function checkForLose() {
			if ( player.HP <= 0 ) {
				$( '#attack' )
					.prop( 'disabled', true );
				$( "#game-text" )
					.empty();
				$( "#game-text" )
					.html( "<h3>You won't last long against te Alpha Sections like that. <br> You better go again. It's for your own good.</h3>" )
				$( "#restart" )
					.show();
			}
		}

		gameSetup();


        
		$( "#attack" )
			.on( "click", function( event ) {
				playerAttack();
				if ( !checkForWin() ) {
					defenderAttack();
				}


			} );

		$( "#restart" )
			.on( "click", function( event ) {
				$( this )
					.hide();
				$( "#player" )
					.remove();
				$( "#defender" )
					.remove();
				$( "#opponents .opponent" )
					.empty();
				$( "#game-text" )
					.empty();
				$( "#characters-initial" )
					.show();
				$( "#fight-row" )
					.hide();
				$( "#opponents" )
					.hide();

				rounds = 0;
				attacks = 0;
				opponentSelect = false;

				gameSetup();




			} );


	} )