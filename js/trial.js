class trialObject {
    constructor(options = {}) {
        Object.assign(
            this, {
                subj: false,
                titles: "",
                dataFile: "",
                savingScript: "save.php",
                savingDir: "data/testing",
                stimSource: "",
                stimType: "",
                trialInput: "",
                intertrialInterval: 500,
                //updateFunc: false,
                // trialFunc: false,
                endExptFunc: false
            },
            options
        );
        this.trialIndex = 0;
        this.trialN = Object.keys(this.trialInput).length;
        this.subjStartDate = this.subj.startDate;
        this.subjStartTime = this.subj.startTime;
        this.allData = list_to_formatted_string(this.titles, ";");
        this.option1PlayTime = 0;
        this.option2PlayTime = 0;
        this.option3PlayTime = 0;
    }

    init(){
        this.randomizedExptIDList = shuffle_array(Object.keys(this.trialInput));
        console.log(this.randomizedExptIDList);
        this.updateStimuli(this.trialIndex);
    }

    record(choicePos){
        this.rt = this.decideTime - this.startTime;
        this.choicePos = choicePos;
        var dataList = list_from_attribute_names(this, this.titles);
        this.allData += list_to_formatted_string(dataList, ";");
        console.log(this.allData);
    }

    update(){
        this.trialIndex++;
        if (this.trialIndex == this.trialN){
            this.endExptFunc();
        } else {
            this.option1PlayTime = 0;
            this.option2PlayTime = 0;
            this.option3PlayTime = 0;
            setTimeout(RESET_TRIAL_INTERFACE, this.intertrialInterval);
        }
    }

    updateStimuli(trialIndex){
        this.exptId = this.randomizedExptIDList[this.trialIndex];
        $('#option1').attr('src', this.stimSource + this.trialInput[this.exptId][0] + this.stimType);
        $('#option2').attr('src', this.stimSource + this.trialInput[this.exptId][1] + this.stimType);
        $('#option3').attr('src', this.stimSource + this.trialInput[this.exptId][2] + this.stimType);
    }

    save() {
        var postData = {
            'directory_path': this.savingDir,
            'file_name': this.dataFile,
            'data': this.allData // data to save
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }
}

function PLAY(ele) {
    $(ele).css("background","#9D8F8F");
    var option = $(ele).attr("id");
    test[option + "PlayTime"] += 1;
    if (test.option1PlayTime > 0 && test.option2PlayTime > 0 && test.option3PlayTime > 0){
        $(".responseBut").show();
    }
}

function SUBMIT_RESPONSE_LEFT() {
    SUBMIT_RESPONSE('left');
}

function SUBMIT_RESPONSE_MIDDLE() {
    SUBMIT_RESPONSE('middle');
}

function SUBMIT_RESPONSE_RIGHT() {
    SUBMIT_RESPONSE('right');
}

function SUBMIT_RESPONSE(resp) {
    test.decideTime = Date.now();
    $(".responseBut").hide();
    $("#stimuliBox img").css("background", "none");
    $("#stimuliBox img").hide();
    test.record(resp);
    test.update();
}

function RESET_TRIAL_INTERFACE() {
    test.updateStimuli(test.trialIndex);
    $("#stimuliBox img").show();
    test.startTime = Date.now();
}

const TRIAL_TITLES = [
    "subjNum",
    "trialIndex",
    "subjStartDate",
    "subjStartTime",
    "exptId",
    "choicePos",
    "option1PlayTime",
    "option2PlayTime",
    "option3PlayTime",
    "rt"
];