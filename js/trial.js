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
                //trialInput: "",
                intertrialInterval: 500,
                //updateFunc: false,
                // trialFunc: false,
                endExptFunc: false
            },
            options
        );
        this.trialIndex = 0;
        this.subjNum = this.subj.num;
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
        $('#leftRespBut').on('mouseup', SUBMIT_RESPONSE_LEFT);
        $('#middleRespBut').on('mouseup', SUBMIT_RESPONSE_MIDDLE);
        $('#rightRespBut').on('mouseup', SUBMIT_RESPONSE_RIGHT);
        UPDATE_STIMULI();
        this.startTime = Date.now();
    }

    record(choicePos){
        this.rt = (this.decideTime - this.startTime)/1000;
        this.choicePos = choicePos;
        this.vidPlayCounts = JSON.stringify(this.vidPlayCounts);
        var dataList = list_from_attribute_names(this, this.titles);
        this.allData += list_to_formatted_string(dataList, ";");
        console.log(this.allData);
        this.save();
        this.allData = "";
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
            UPDATE_STIMULI();
            setTimeout(SHOW_VIDEOS, this.intertrialInterval);
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

function UPDATE_STIMULI() {
    test.exptId = test.randomizedExptIDList[test.trialIndex];
    $('#vid1').attr('src', test.stimSource + test.trialInput[test.exptId][0] + test.stimType);
    $('#vid2').attr('src', test.stimSource + test.trialInput[test.exptId][1] + test.stimType);
    $('#vid3').attr('src', test.stimSource + test.trialInput[test.exptId][2] + test.stimType);
    $('#vid1')[0].load();
    $('#vid2')[0].load();
    $('#vid3')[0].load();
    $('#stimuliBox .vid').on('ended', CHECK_PLAY_COUNT);
    $('#stimuliBox .vid').on('mouseup', PLAY);
    let nextTrialIndex = test.trialIndex + 1;
    if (nextTrialIndex != test.trialN) { // XXX need to add this after Yiling figures out the trial list input method
        let nextExptId = test.randomizedExptIDList[test.trialIndex + 1];
        buffer_video($('#bufferVid1')[0], test.stimSource + test.trialInput[nextExptId][0] + test.stimType); // load next trial's videos
        buffer_video($('#bufferVid2')[0], test.stimSource + test.trialInput[nextExptId][1] + test.stimType); // load next trial's videos
        buffer_video($('#bufferVid3')[0], test.stimSource + test.trialInput[nextExptId][2] + test.stimType); // load next trial's videos
    }
}

function SHOW_VIDEOS() {
    $('#stimuliBox .vid').show();
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
    $('.vid').off('mouseup');
    DISABLE_HOVER_EFFECT();
    $(".responseBut").hide();
    let target = $(ele.target).closest('.vid');
    target[0].play();
    test.inView = check_fully_in_view($('.vid'));
}

function CHECK_PLAY_COUNT(ele) {
    $(ele.target)[0].currentTime = 0
    $(ele.target).css("border-color","#9D8F8F");
    ENABLE_HOVER_EFFECT();
    $('.vid').on('mouseup', PLAY);
    test.vidPlayCounts[$(ele.target).attr('id')] += 1;
    if (test.vidPlayCounts['vid1'] > 0 && test.vidPlayCounts['vid2'] > 0 && test.vidPlayCounts['vid3'] > 0){
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
    $("#stimuliBox .vid").css("border-color", "black");
    $("#stimuliBox .vid").hide();
    test.record(resp);
    test.update();
}

function RESET_TRIAL_INTERFACE() {
    UPDATE_STIMULI();
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