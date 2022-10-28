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
        this.subjStartDate = this.subj.date;
        this.subjStartTime = this.subj.startTime;
        this.allData = list_to_formatted_string(this.titles, ";");
        this.vidPlayCounts = {
            'vid1': 0,
            'vid2': 0,
            'vid3': 0,
        }
    }

    init(){
        this.randomizedExptIDList = shuffle_array(Object.keys(this.trialInput));
        console.log(this.randomizedExptIDList);
        UPDATE_STIMULI();
        this.startTime = Date.now();
    }

    record(choicePos){
        this.rt = this.decideTime - this.startTime;
        this.choicePos = choicePos;
        this.vidPlayCounts = JSON.stringify(this.vidPlayCounts);
        var dataList = list_from_attribute_names(this, this.titles);
        this.allData += list_to_formatted_string(dataList, ";");
        console.log(this.allData);
    }

    update(){
        this.trialIndex++;
        if (this.trialIndex == this.trialN){
            this.endExptFunc();
        } else {
            this.vidPlayCounts = {
                'vid1': 0,
                'vid2': 0,
                'vid3': 0,
            }
            setTimeout(RESET_TRIAL_INTERFACE, this.intertrialInterval);
        }
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

function DISABLE_HOVER_EFFECT() {
    $(".vid").css({
        "pointer-events": "none"
    });
}

function ENABLE_HOVER_EFFECT() {
    $(".vid").css({
        "pointer-events": "revert",
    });
}

function PLAY(ele) {
   // $('.vid').off('mouseup');
    DISABLE_HOVER_EFFECT();
    $('.responseBut').addClass('inactiveButton');
    $('.responseBut').off('mouseup');
    let target = $(ele).closest('.vid');
    target[0].play();
    CHECK_PLAY_COUNT(ele);
    //trial.inView = CHECK_FULLY_IN_VIEW($('.vid'));
    let targetID = $(ele).attr('id');
    $("#" + targetID).css("border-color","#9D8F8F");  //xxx: don't know how to check if videos are watched til the end, want to add this after watched
}

function CHECK_PLAY_COUNT(ele) {
    ENABLE_HOVER_EFFECT();
   // $('.vid').on('mouseup', event, PLAY); //xxx: don't know how to enable play + ENABLE_HOVER_EFFECT after watched
    let targetID = $(ele).attr('id');
    test.vidPlayCounts[targetID] += 1;
    if (test.vidPlayCounts['vid1'] > 0 && test.vidPlayCounts['vid2'] > 0 && test.vidPlayCounts['vid3'] > 0){
        $(".responseBut").show();
        $('.responseBut').removeClass('inactiveButton');
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
    $("#stimuliBox .vid").css("border-color", "black");
    $("#stimuliBox .vid").hide();
    test.record(resp);
    test.update();
}

function UPDATE_STIMULI() {
    test.exptId = test.randomizedExptIDList[test.trialIndex];
    $('#vid1').attr('src', test.stimSource + test.trialInput[test.exptId][1] + test.stimType);
    $('#vid2').attr('src', test.stimSource + test.trialInput[test.exptId][1] + test.stimType);
    $('#vid3').attr('src', test.stimSource + test.trialInput[test.exptId][2] + test.stimType);
}

function RESET_TRIAL_INTERFACE() {
    UPDATE_STIMULI();
    $("#stimuliBox .vid").show();
    ENABLE_HOVER_EFFECT();
    test.startTime = Date.now();
}

const TRIAL_TITLES = [
    "subjNum",
    "subjStartDate",
    "subjStartTime",
    "trialIndex",
    "exptId",
    "choicePos",
    "vidPlayCounts",
    "rt"
];