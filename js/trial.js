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
                // endExptFunc: false
            },
            options
        );
        this.trialIndex = 0;
        this.trialN = Object.keys(this.trialInput).length;
        // this.sonaID = this.subj.sonaID;
        // this.subjStartDate = this.subj.startDate;
        // this.subjStartTime = this.subj.startTime;
        this.allData = list_to_formatted_string(this.titles, ";");
        this.option1PlayTime = 0;
        this.option2PlayTime = 0;
        this.option3PlayTime = 0;
    }

    init(){
        this.randomizedExptIDList = SHUFFLE_ARRAY(Object.keys(this.trialInput));
        console.log(this.randomizedExptIDList);
        this.updateStimuli(this.trialIndex);
    }


    record(choicePos){
        this.rt = this.decideTime - this.startTime;
        this.option1 = this.trialInput[this.exptId][0]; // need to adjust this to left/middle/right
        this.option2 = this.trialInput[this.exptId][1];
        this.option3 = this.trialInput[this.exptId][2];
        this.choice = this[choicePos];
        this.choicePos = choicePos;
        var dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
        this.allData += list_to_formatted_string(dataList, ";");
        console.log(this.allData);
    }

    update(){
        this.trialIndex++;
        if (this.trialIndex == this.trialN){
            this.save();
        }
        this.option1PlayTime = 0;
        this.option2PlayTime = 0;
        this.option3PlayTime = 0;
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
    setTimeout(RESET_TRIAL_INTERFACE, test.intertrialInterval);
    //xxx: need to buffer videos for the next trial
}

function RESET_TRIAL_INTERFACE() {
    test.updateStimuli(this.trialIndex);
    $("#stimuliBox img").show();
    test.startTime = Date.now();
}

const TRIAL_TITLES = [
    "trialIndex",
    //"sonaID",
    //"startDate",
    //"startTime",
    "exptId",
    "option1",
    "option2",
    "option3",
    "choice",
    "option1PlayTime",
    "option2PlayTime",
    "option3PlayTime",
    "choicePos",
    "rt"
];

//HELPER FUNCTIONS

function LIST_FROM_ATTRIBUTE_NAMES(obj, string_list) {
    var list = []
    for (var i = 0; i < string_list.length; i++) {
        list.push(obj[string_list[i]]);
    }
    return list;
}

function list_to_formatted_string(data_list, divider) {
    divider = (divider === undefined) ? '\t' : divider;
    var string = '';
    for (var i = 0; i < data_list.length - 1; i++) {
        string += data_list[i] + divider;
    }
    string += data_list[data_list.length - 1] + '\n';
    return string;
}

function SHUFFLE_ARRAY(array) {
    var j, temp;
    for (var i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}