class instrObject {
    constructor(options = {}) {
        Object.assign(this, {
            text: [],
            funcDict: {},
        }, options);
        this.index = 0;
        this.instrKeys = Object.keys(this.funcDict).map(Number);
        this.qAttemptN = 0;
    }

    start(textBox = $("#instrBox"), textElement = $("#instrText")) {
        textElement.html(this.text[0]);
        if (this.instrKeys.includes(this.index)) {
            this.funcDict[this.index]();
        }
        textBox.show();
    }

    next(textElement = $("#instrText")) {
        this.index += 1;
        if (this.index < this.text.length) {
            textElement.html(this.text[this.index]);
            if (this.instrKeys.includes(this.index)) {
                this.funcDict[this.index]();
            }
        }
    }
}

var instr_text = new Array;
instr_text[0] = "<strong>Welcome!</strong><br /><br />I am a scientist researching human actions, and I am studying how people view other people's interactions.";
instr_text[1] = "Your contributions may help in designing robots and making animations in movies or video games!<br /><br />And, most importantly, I hope this is fun for you, too!";
instr_text[2] = "This experiment will take about XXX minutes to complete.<br /><br />Please help me by reading the instructions in the next few pages carefully, and avoid using the refresh or back buttons.";
instr_text[3] = "For this study to work, the webpage will automatically switch to the fullscreen view on the next page. Please stay in the fullscreen mode until the study automatically switches out from it.";
instr_text[4] = "Please also turn off any music you are playing. Music is known to affect my kind of studies and it will make your data unusable.";
instr_text[5] = "In this experiment, I will show you some simple animations of two triangles interacting with each other, just like the one in the example below.";
instr_text[6] = "Each time, three boxes containing three animations will show up. You may click to play each of them as many time as you like in whatever order you choose.";
instr_text[7] = "Your job is to pick the odd one out. That is to say, you should select the animation that looks the most different among the three.";
instr_text[8] = "You will make the selection by clicking on the button below the one you are choosing.";
instr_text[9] = "Note that you can only make your selection after you watch all three animations.";
instr_text[10] = "Let's try it once on the next page!";
instr_text[11] = "";
instr_text[12] = "I hope that was clear!<br /><br />By the way, you don't need to spend too much time thinking about what to choose. Just follow your intuitive impressions.";
instr_text[13] = "One last thing: Please make sure you make you choice based on the content of the animations and not the length or duration of them."
instr_text[14] = "The next page is a quick instruction quiz. (It's very simple!)";
instr_text[15] = "";
instr_text[16] = "Great! You can press SPACE to start. Please focus after you start. (Don't switch to other windows or tabs!)";

const INSTR_FUNC_DICT = {
    0: SHOW_INSTR,
    1: SHOW_INSTR,
    2: SHOW_INSTR,
    3: SHOW_MAXIMIZE_WINDOW,
    4: SHOW_NO_MUSIC,
    5: SHOW_EXAMPLE_ANIMATION,
    6: SHOW_INSTR,
    7: SHOW_INSTR,
    8: SHOW_INSTR,
    9: SHOW_INSTR,
    10: SHOW_INSTR,
    11: SHOW_PRACTICE,
    12: SHOW_INSTR,
    13: SHOW_INSTR,
    14: SHOW_INSTR,
    15: SHOW_INSTR_QUIZ,
    16: SHOW_CONSENT
};

function SHOW_INSTR(){
    $('#instrImg').css('display', 'none');
    $('#instrText').show();
    $('#instrNextBut').show();
}

function SHOW_INSTR_IMG(file_name) {
    $('#instrImg').attr('src', 'stim/' + file_name);
    $('#instrImg').css('display', 'block');
}

function SHOW_MAXIMIZE_WINDOW() {
    SHOW_INSTR_IMG('maximize_window.png');
}

function SHOW_NO_MUSIC() {
    SHOW_INSTR_IMG('no_music.png');
}

function SHOW_EXAMPLE_ANIMATION() {
    $('#instrImg').css('display', 'none');
    // XXX I'll write this after merging from the video branch
}

function SHOW_PRACTICE() {
    $('#instrImg').css('display', 'none');
    // XXX I'll write this after merging from the video branch
}

function SHOW_INSTR_QUIZ() {
    $('#instrBox').hide();
    $('#quizBox').show();
}

function SUBMIT_INSTR_QUIZ() {
    const CHOICE = $('input[name="quiz"]:checked').val();
    if (typeof CHOICE === 'undefined') {
        $('#quizWarning').text('Please answer the question. Thank you!');
    } else if (CHOICE != 'different') {
        instr.qAttemptN += 1;
        $('#quizBox').hide();
        $('#instrText').text('You have given an incorrect answer. Please read the instructions again carefully.');
        $('#instrBox').show();
        instr.index = -1;
        $('input[name="quiz"]:checked').prop('checked', false);
    } else {
        instr.next();
        $('#quizBox').hide();
        $('#instrBox').show();
    }
}

function SHOW_CONSENT() {
    $('#instrNextBut').hide();
    $('#consentBox').show();
    $(document).keyup(function(e) {
        if (e.key == ' ') {
            $(document).off('keyup');
            $('#instrBox').hide();
            $('#taskBox').show();
            test.startTime = Date.now();
        }
    });
}

var instr_options = {
    text: instr_text,
    funcDict: INSTR_FUNC_DICT,
};
