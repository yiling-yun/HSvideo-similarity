const FORMAL = false;
const EXPERIMENT_NAME = "HSvideo";
const FILE_TYPE = ".png";
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
                intertrialInterval: 500,
                //updateFunc: false,
                // trialFunc: false,
                // endExptFunc: false
            },
            options
        );
        this.trialIndex = 0;
        this.trialN = Object.keys(TRIAL_INPUT).length;
        // this.sonaID = this.subj.sonaID;
        // this.subjStartDate = this.subj.startDate;
        // this.subjStartTime = this.subj.startTime;
        this.allData = LIST_TO_FORMATTED_STRING(this.titles, ";");
        this.option1PlayTime = 0;
        this.option2PlayTime = 0;
        this.option3PlayTime = 0;
    }

    run(){
        setTimeout(UPDATE_STIMULI, this.intertrialInterval, this.trialIndex);
        this.startTime = Date.now();
    }

    record(choicePos){
        this.rt = Date.now() - this.startTime;
        this.option1 = TRIAL_INPUT[this.trialIndex][0];
        this.option2 = TRIAL_INPUT[this.trialIndex][1];
        this.option3 = TRIAL_INPUT[this.trialIndex][2];
        this.choice = this[this.choicePos];
        this.choicePos = choicePos;
        var dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
        this.allData += LIST_TO_FORMATTED_STRING(dataList, ";");
        console.log(this.allData);
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

function UPDATE_STIMULI(trialIndex) {
    $('#option1').attr('src', STIM_SOURCE + TRIAL_INPUT[trialIndex][0] + FILE_TYPE);
    $('#option2').attr('src', STIM_SOURCE + TRIAL_INPUT[trialIndex][1] + FILE_TYPE);
    $('#option3').attr('src', STIM_SOURCE + TRIAL_INPUT[trialIndex][2] + FILE_TYPE);
};

function UPDATE_TRIAL_INFO(obj, choicePos) {
    obj.record(choicePos);

    //prepare for the next trial
    obj.trialIndex++;
    if (obj.trialIndex == obj.trialN){
        obj.save();
    }
    obj.option1PlayTime = 0;
    obj.option2PlayTime = 0;
    obj.option3PlayTime = 0;
    obj.run();
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
}

function RESET_TRIAL_INTERFACE() {
    $("#stimuliBox img").css("background", "none");
    $("input[name = 'trialQ']:checked").prop("checked", false);
    $("#stimuliBox label").hide();
    $("#nextTrialBut").hide();
}

function NEXT_TRIAL() {
    var choicePos = $("input[name = 'trialQ']:checked").val();
    UPDATE_TRIAL_INFO(test, choicePos);
    RESET_TRIAL_INTERFACE();
    //xxx: need to buffer videos for the next trial
};

const TRIAL_TITLES = [
    "trialIndex",
    //"sonaID",
    //"startDate",
    //"startTime",
    //"exptId",
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