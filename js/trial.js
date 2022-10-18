const FORMAL = false;
const EXPERIMENT_NAME = "HSvideo";
const STIM_TYPE = ".png";
const TRIAL_FILE = "trial_" + EXPERIMENT_NAME + ".txt";
const SAVING_SCRIPT = 'save.php';
const SAVING_DIR = FORMAL ? "data/formal":"data/testing";
const INTERTRIAL_INTERVAL = 500; //ms
const STIM_SOURCE = 'stim/Facebook/';
const TRIAL_INPUT = {
    0: [1,2,3],
    1: [2,3,4],
    2: [3,4,1],
    3: [10,11,13],
    4: [21,31,14],
    5: [20,31,14]
};
// const TRIAL_INPUT = {
//     0: ["1012_push", "4397_hug", "4408_lead"],
//     1: ["5408_kiss", "5814_talk to", "5816_ignore"],
//     2: ["5814_talk to", "5816_ignore", "4408_lead"],
//     3: ["5814_talk to", "4408_lead", "5816_ignore"],
//     4: ["5814_talk to", "5816_ignore", "4408_lead"],
//     5: ["5814_talk to", "4408_lead", "5816_ignore"]
// };


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
        this.allData = LIST_TO_FORMATTED_STRING(this.titles, ";");
        this.option1PlayTime = 0;
        this.option2PlayTime = 0;
        this.option3PlayTime = 0;
    }

    init(){
        this.randomizedExptIDList = SHUFFLE_ARRAY(Object.keys(this.trialInput));
        console.log(this.randomizedExptIDList);
        this.updateStimuli(this.randomizedExptIDList[this.trialIndex]);
    }


    record(choicePos){
        this.rt = this.decideTime - this.startTime;
        this.exptId = this.randomizedExptIDList[this.trialIndex];
        this.option1 = this.trialInput[this.exptId][0];
        this.option2 = this.trialInput[this.exptId][1];
        this.option3 = this.trialInput[this.exptId][2];
        this.choice = this[choicePos];
        this.choicePos = choicePos;
        var dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
        this.allData += LIST_TO_FORMATTED_STRING(dataList, ";");
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
        this.updateStimuli(this.randomizedExptIDList[this.trialIndex]);
    }

    updateStimuli(trialIndex){
        $('#option1').attr('src', this.stimSource + this.trialInput[this.randomizedExptIDList[trialIndex]][0] + this.stimType);
        $('#option2').attr('src', this.stimSource + this.trialInput[this.randomizedExptIDList[trialIndex]][1] + this.stimType);
        $('#option3').attr('src', this.stimSource + this.trialInput[this.randomizedExptIDList[trialIndex]][2] + this.stimType);
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
        $("#stimuliBox label").show();
    }
}

function SHOW_NEXT_BUT() {
    $("#nextTrialBut").show();
    test.decideTime = Date.now();
}

function RESET_TRIAL_INTERFACE() {
    $("#stimuliBox img").css("background", "none");
    $("input[name = 'trialQ']:checked").prop("checked", false);
    $("#stimuliBox label").hide();
    $("#nextTrialBut").hide();
    test.startTime = Date.now();
}

function NEXT_TRIAL() {
    var choicePos = $("input[name = 'trialQ']:checked").val();
    test.record(choicePos);
    test.update();
    setTimeout(RESET_TRIAL_INTERFACE, test.intertrialInterval);
    //xxx: need to buffer videos for the next trial
};

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

var trial_options = {
    subj: 'pre-define',
    titles: TRIAL_TITLES,
    dataFile: TRIAL_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    stimSource: STIM_SOURCE,
    stimType: STIM_TYPE,
    trialInput: TRIAL_INPUT,
    intertrialInterval: INTERTRIAL_INTERVAL,
    //updateFunc: TRIAL_UPDATE,
    //trialFunc: TRIAL,
    //endExptFunc: END_EXPT
}

//HELPER FUNCTIONS

function LIST_FROM_ATTRIBUTE_NAMES(obj, string_list) {
    var list = []
    for (var i = 0; i < string_list.length; i++) {
        list.push(obj[string_list[i]]);
    }
    return list;
}

function LIST_TO_FORMATTED_STRING(data_list, divider) {
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