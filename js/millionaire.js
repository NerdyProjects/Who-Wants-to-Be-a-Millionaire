/**
* Edits the number prototype to allow money formatting
*
* @param fixed the number to fix the decimal at. Default 2.
* @param decimalDelim the string to deliminate the non-decimal
*        parts of the number and the decimal parts with. Default "."
* @param breakdDelim the string to deliminate the non-decimal
*        parts of the number with. Default ","
* @return returns this number as a USD-money-formatted String
*		  like this: x,xxx.xx
*/
Number.prototype.money = function(fixed, decimalDelim, breakDelim){
	var n = this, 
	fixed = isNaN(fixed = Math.abs(fixed)) ? 2 : fixed, 
	decimalDelim = decimalDelim == undefined ? "." : decimalDelim, 
	breakDelim = breakDelim == undefined ? "," : breakDelim, 
	negative = n < 0 ? "-" : "", 
	i = parseInt(n = Math.abs(+n || 0).toFixed(fixed)) + "", 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return negative + (j ? i.substr(0, j) +
		 breakDelim : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + breakDelim) +
		  (fixed ? decimalDelim + Math.abs(n - i).toFixed(fixed).slice(2) : "");
}

/**
* Plays a sound via HTML5 through Audio tags on the page
*
* @require the id must be the id of an <audio> tag.
* @param id the id of the element to play
* @param loop the boolean flag to loop or not loop this sound
*/
startSound = function(id, loop, onEnd) {
	soundHandle = document.getElementById(id);
	if(loop)
		soundHandle.setAttribute('loop', loop);
	soundHandle.play();
  if(typeof onEnd != 'undefined') {
    soundHandle.onended = onEnd;
  }
}

playVideo = function(src, onEnd) {
  /*
  $("#videoplayer").find("#vid").attr("src", src);
  $("#videoplayer").show();
  $("#videoplayer").on("ended", onEnd);
  */
  if(typeof src != 'undefined') {
    var video = document.getElementById('videoplayer');
    var source = video.getElementsByTagName("source")[0];
    var bgmusic = document.getElementById('background');
    bgmusic.pause();
    video.pause();
    
    $("#video").show();

    source.setAttribute('src', "video/" + src); 
    video.onended = function() { $("#video").hide(); bgmusic.play(); onEnd() };

    video.load();
    video.play();
  } else {
    onEnd();
  }
}

/**
* The View Model that represents one game of
* Who Wants to Be a Millionaire.
* 
* @param data the question bank to use
*/
var MillionaireModel = function(data) {
	var self = this;

	// The 15 questions of this game
    this.questions = data.questions;

    // A flag to keep multiple selections
    // out while transitioning levels
    this.transitioning = false;

    // The current money obtained
 	this.money = new ko.observable(0);

 	// The current level(starting at 1) 
 	this.level = new ko.observable(1);

 	// The three options the user can use to 
 	// attempt to answer a question (1 use each)
 	this.usedFifty = new ko.observable(false);
 	this.usedPhone = new ko.observable(false);
 	this.usedAudience = new ko.observable(false);

 	// Grabs the question text of the current question
 	self.getQuestionText = function() {
 		return self.questions[self.level() - 1].question;
 	}

 	// Gets the answer text of a specified question index (0-3)
 	// from the current question
 	self.getAnswerText = function(index) {
 		return self.questions[self.level() - 1].content[index];
 	}

 	// Uses the fifty-fifty option of the user
 	self.schnaps = function(item, event) {
 		if(self.transitioning)
 			return;
 		//$(event.target).fadeOut('slow');
 		var correct = this.questions[self.level() - 1].correct;
    var safety = 100;
    do {
      var first = Math.floor((Math.random() * 4));
      var visible = $('#answer-one').is(':visible');
      if(first == 1) {
        visible = $('#answer-two').is(':visible');
      } else if(first == 2) {
        visible = $('#answer-three').is(':visible');
      } else if(first == 3) {
        visible = $('#answer-four').is(':visible');
      }
      safety = safety - 1;
    } while(safety > 0 && (!visible || first == correct));
 		var second = 4;
 		if(first == 0 || second == 0) {
 			$("#answer-one").fadeOut('slow');
 		}
 		if(first == 1 || second == 1) {
 			$("#answer-two").fadeOut('slow');
 		}
 		if(first == 2 || second == 2) {
 			$("#answer-three").fadeOut('slow');
 		}
 		if(first == 3 || second == 3) {
 			$("#answer-four").fadeOut('slow');
 		}
 	}

 	// Uses the fifty-fifty option of the user
 	self.fifty = function(item, event) {
 		if(self.transitioning)
 			return;
 		$(event.target).fadeOut('slow');
 		var correct = this.questions[self.level() - 1].correct;
 		var first = (correct + 1) % 4;
 		var second = (first + 1) % 4;
 		if(first == 0 || second == 0) {
 			$("#answer-one").fadeOut('slow');
 		}
 		if(first == 1 || second == 1) {
 			$("#answer-two").fadeOut('slow');
 		}
 		if(first == 2 || second == 2) {
 			$("#answer-three").fadeOut('slow');
 		}
 		if(first == 3 || second == 3) {
 			$("#answer-four").fadeOut('slow');
 		}
 	}

 	// Fades out an option used if possible
 	self.fadeOutOption = function(item, event) {
 		if(self.transitioning)
 			return;
 		$(event.target).fadeOut('slow');
 	}

 	// Attempts to answer the question with the specified
 	// answer index (0-3) from a click event of elm
 	self.answerQuestion = function(index, elm) {
 		if(self.transitioning)
 			return;
 		self.transitioning = true;
 		if(self.questions[self.level() - 1].correct == index) {
 			self.rightAnswer(elm);
 		} else {
 			self.wrongAnswer(elm);
 		}
 	}

  self.replayVideo = function(offset) {
    $("#game").fadeOut('slow', function() {
      playVideo(self.questions[self.level() - offset].video, function() {
        $("#game").fadeIn('slow');
      });
    });
  }

  self.changeLevel = function(inc) {
    self.level(self.level() + inc);
  }

  self.win = function() {
    $("#question-box").fadeOut('slow');
    $("#answer-box").fadeOut('slow', function() {
      $("#game-over").html('Herzlichen Glückwunsch!<br />Ihr habt gewonnen!');
      var bgmusic = document.getElementById('background');
      bgmusic.pause();
      $("#outro").fadeIn('slow', function() {
        startSound('winsound', false);
      });
    });
  };


 	// Executes the proceedure of a correct answer guess, moving
 	// the player to the next level (or winning the game if all
 	// levels have been completed)
 	self.rightAnswer = function(elm) {
 		$("#" + elm).slideUp('slow', function() {
 			$("#" + elm).css('background', 'green').slideDown('slow', function() {
 				self.money($(".active").data('amt'));
        startSound('rightsound', false, function() {
          $("#game").fadeOut('slow', function() {
            playVideo(self.questions[self.level() - 1].video, function() {
              $("#game").fadeIn('slow', function() {
                if(self.level() + 1 > self.questions.length) {
                  self.win();
                } else {
                  self.level(self.level() + 1);
                  $("#" + elm).css('background', 'none');
                  $("#answer-one").show();
                  $("#answer-two").show();
                  $("#answer-three").show();
                  $("#answer-four").show();
                  self.transitioning = false;
                }
              });
            });
          });
        });
 			});
 		});
 	}

 	// Executes the proceedure of guessing incorrectly, losing the game.
 	self.wrongAnswer = function(elm) {
 		$("#" + elm).slideUp('slow', function() {
 			startSound('wrongsound', false);
 			$("#" + elm).css('background', 'red').slideDown('slow', function() {
        setTimeout(function() {
          $("#game").fadeOut('slow', function() {
            if(self.level() > 9) {
              $("#game-over").html('Leider falsch!<br />!');
              // Pause bis weiter
              $("#game-over").fadeIn('slow');
            } else {
              $("#game-over").html('<br />Bist Du Dir wirklich sicher?');
              $("#game-over").fadeIn('slow');
            }
          });
        }, 500);
        setTimeout(function() {
          $("#game-over").fadeOut('slow', function() {
            $("#game").fadeIn('slow');
            $("#" + elm).css('background', 'none');
            $("#answer-one").show();
            $("#answer-two").show();
            $("#answer-three").show();
            $("#answer-four").show();
            self.transitioning = false;
          });
        }, 6000);
 			});
 		});
 	}

 	// Gets the money formatted string of the current won amount of money.
 	self.formatMoney = function() {
	    return self.money().money(0, '.', ',');
	}
};

function set_video_height() {
  $('video').height($(window).height());
}

// Executes on page load, bootstrapping
// the start game functionality to trigger a game model
// being created
$(document).ready(function() {
  $(window).bind('resize', set_video_height);
  set_video_height();
  $("#question-box").hide();
  $("#answer-box").hide();
  $("#outro").hide();

	$.getJSON("questions.json", function(data) {
		for(var i = 1; i <= data.games.length; i++) {
			$("#problem-set").append('<option value="' + i + '">' + i + '</option>');
		}
		$("#pre-start").show();
		$("#start").click(function() {
			var index = $('#problem-set').find(":selected").val() - 1;
      var game = new MillionaireModel(data.games[index]);
			ko.applyBindings(game);
      $(window).bind('keypress', game, function(event) { 
        switch(event.which) {
          case 115:
            $("#intro").hide();
            $("#question-box").show();
            $("#answer-box").show();
            break;
          case 97:
            console.log( event );
            event.data.answerQuestion(0, "answer-one");
            break;
          case 98:
            event.data.answerQuestion(1, "answer-two");
            break;
          case 99:
            event.data.answerQuestion(2, "answer-three");
            break;
          case 100:
            event.data.answerQuestion(3, "answer-four");
            break;
          case 106:
            event.data.schnaps();
            break;
          case 114:
            event.data.replayVideo(2);
            break;
          case 112:
            event.data.replayVideo(1);
            break;
          case 60:
            event.data.changeLevel(-1);
            break;
          case 62:
            event.data.changeLevel(1);
            break;
          case 101:
            event.data.win();
            break;
        }
      });
			$("#pre-start").fadeOut('slow', function() {
				startSound('background', true);
				$("#game").fadeIn('slow');
			});
		});
	});
});
