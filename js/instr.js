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
instr_text[0] = "<strong>Welcome!</strong><br><br>In this experiment, you will see emojis and make judgments following your intuition. <br><br>Hope you enjoy it!";
instr_text[1] = "On each trial, you will see three emojis. Please select the emoji that looks the most different from the other two.";
instr_text[2] = "You can start the experiment on the next page.";
instr_text[3] = "";


const INSTR_FUNC_DICT = {
    0: SHOW_INSTR,
    1: SHOW_INSTR,
    2: SHOW_INSTR,
    3: START_EXPT,
};

function SHOW_INSTR(){
    $('#instrText').show();
    $('#instrNextBut').show();
};

function START_EXPT(){
    $('#instrBox').hide();
    $('#taskBox').show();
};

var instr_options = {
    text: instr_text,
    funcDict: INSTR_FUNC_DICT,
};
