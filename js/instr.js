class instrObject {

    constructor(options = {}) {
        Object.assign(this, {
            text: [],
            funcDict: {},
        }, options);
        this.index = 0;
        this.instrKeys = Object.keys(this.funcDict).map(Number);
        this.qAttemptN = 1;
        this.readingTimes = {};
    }

    start(textBox = $("#instrBox"), textElement = $("#instrText")) {
        textElement.html(this.text[0]);
        if (this.instrKeys.includes(this.index)) {
            this.funcDict[this.index]();
        }
        textBox.show();
        this.startTimer();
    }

    next(textElement = $("#instrText")) {
        this.endTimer();
        this.saveReadingTime();
        this.index += 1;
        if (this.index < this.text.length) {
            textElement.html(this.text[this.index]);
            if (this.instrKeys.includes(this.index)) {
                this.funcDict[this.index]();
            }
        }
    }

    startTimer() {
        this.startTime = Date.now();
    }

    endTimer() {
        this.endTime = Date.now();
        this.readingDuration = (this.endTime - this.startTime)/1000;
    }

    saveReadingTime() {
        if (typeof(this.readingTimes[this.index])=='undefined'){
            this.readingTimes[this.index] = this.readingDuration;
        }
        else{
            if (this.readingTimes[this.index] < this.readingDuration){
                this.readingTimes[this.index] = this.readingDuration;
            }
        }
    }
}

