// ######## ##     ## ########  ########
// ##        ##   ##  ##     ##    ##
// ##         ## ##   ##     ##    ##
// ######      ###    ########     ##
// ##         ## ##   ##           ##
// ##        ##   ##  ##           ##
// ######## ##     ## ##           ##

// data saving
const FORMAL = false;
const EXPERIMENT_NAME = 'STIM';
const SUBJ_NUM_SCRIPT = 'php/subjNum.php';
const SAVING_SCRIPT = 'php/save.php';
const VISIT_FILE = 'visit_' + EXPERIMENT_NAME + '.txt';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME + '.txt';
const TRIAL_FILE = "trial_" + EXPERIMENT_NAME + ".txt";
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const SAVING_DIR_HOME = '/var/www-data-experiments/cvlstudy_data/YY/'+EXPERIMENT_NAME+'/';
const SAVING_DIR = FORMAL ? SAVING_DIR_HOME+'/formal' : SAVING_DIR_HOME+'/testing';
const ID_GET_VARIABLE_NAME = 'id';
const COMPLETION_URL = 'https://ucla.sona-systems.com/webstudy_credit.aspx?experiment_id=2320&credit_token=8610357a2fb040cb9a68edfb2162a54f&survey_code=';


// stimuli
const STIM_PATH = 'stim/';
const ALL_IMG_LIST = ['blank.png','maximize_window.png','no_music.png','ucla.png'];
const STIM_TYPE = '.mp4';
const INTERTRIAL_INTERVAL = 500; //ms
const STIM_SOURCE = '27movies/';
const EXPT_N = 65;

const INSTR_PRAC_LIST  = [ "5801_hug", "5994_push", "6005_throw"];
const VID_LIST  = [
    "1012_push", "1145_leave", '4397_hug', '4408_lead', 
    '5787_accompany', '5809_pull', '5814_talk to', '5816_ignore', '5843_huddle with', 
    '5849_approach', '5870_poke', '5875_escape', '5878_follow', '5902_hit', 
    '5914_tickle', '5948_flirt with', '5986_fight', '5987_creep up on', '5991_examine', 
    '6004_herd', '6005_throw', '6012_kiss', 
    '6016_scratch', '6017_encircle', '6034_avoid', '6035_capture', '6079_bother'
];
const LABEL_LIST = [
    "Push", "Leave", "Hug", "Lead", "Kiss", "Accompany", "Pull", "Talk to", "Ignore",
    "Huddle with", "Approach", "Follow", "Poke", "Capture", "Escape", "Hit", "Encircle", "Creep up on",
    "Bother", "Scratch", "Fight", "Flirt with", "Examine", "Tickle", "Throw", "Herd", "Avoid"
];
const BUTTON_LIST = [
    "#b1", "#b2", "#b3", "#b4", "#b5", "#b6", "#b7", "#b8", "#b9",
    "#b10", "#b11", "#b12", "#b13", "#b14", "#b15", "#b16", "#b17", "#b18",
    "#b19", "#b20", "#b21", "#b22", "#b23", "#b24", "#b25", "#b26", "#b27"
]
const TRIAL_INPUT    = VID_LIST.sort((a, b)   => 0.5 - Math.random());
const SHUFFLED_LABEL = LABEL_LIST.sort((a, b) => 0.5 - Math.random());
var practice = true;
var playTime = 0;
var playTimeL = 0;
var indexVid = 0;

// object variables
let subj, instr, test;

// criteria
const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;
const INSTR_READING_TIME_MIN = 0.3;

//  ######  #######    #    ######  #     #
//  #     # #         # #   #     #  #   #
//  #     # #        #   #  #     #   # #
//  ######  #####   #     # #     #    #
//  #   #   #       ####### #     #    #
//  #    #  #       #     # #     #    #
//  #     # ####### #     # ######     #


$(document).ready(function() {
    for (let i = 0; i < 27; i++) {
        $(BUTTON_LIST[i]).text(SHUFFLED_LABEL[i]);
    }

    subj = new Subject(subj_options);
    subj.id = subj.getID(ID_GET_VARIABLE_NAME);
    subj.saveVisit();
    if (subj.phone) {
        halt_experiment('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at yiling.yun@g.ucla.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
    } else if (subj.validID){
        load_img(0, STIM_PATH + STIM_SOURCE, ALL_IMG_LIST);
        instr = new instrObject(instr_options);
        instr.start();
    }
});

function halt_experiment(explanation) {
    $('.pageBox').hide();
    $('#instrText').html(explanation);
    $('#instrNextBut').hide();
    $('#instrBox').show();
}

//   #####  #     # ######        # #######  #####  #######
//  #     # #     # #     #       # #       #     #    #
//  #       #     # #     #       # #       #          #
//   #####  #     # ######        # #####   #          #
//        # #     # #     # #     # #       #          #
//  #     # #     # #     # #     # #       #     #    #
//   #####   #####  ######   #####  #######  #####     #

const SUBJ_TITLES = [
    'num',
    'date',
    'startTime',
    'id',
    'userAgent',
    'endTime',
    'duration',
    'quizAttemptN',
    'instrReadingTimes',
    'quickReadingPageN',
    'hiddenCount',
    'hiddenDurations',
    'exptVer',
    'comments',
    'serious',
    'maximized',
    'problems',
    'gender',
    'age',
    'inView',
    'viewportW',
    'viewportH'
];

function update_task_object_subj_num() {
    if (typeof test !== 'undefined'){
        test.num = subj.num;
    }
}

function submit_debriefing_questions() {
    const OPEN_ENDED_ATTRIBUTE_NAMES = ['comments', 'problems', 'age'];
    const CHOICE_ATTRIBUTE_NAMES = ['serious', 'maximized', 'gender'];
    const ALL_RESPONDED = show_hide_warnings(OPEN_ENDED_ATTRIBUTE_NAMES, CHOICE_ATTRIBUTE_NAMES);
    if (ALL_RESPONDED) {
        for (let a of OPEN_ENDED_ATTRIBUTE_NAMES) {
            subj[a] = subj[a].replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        subj.quizAttemptN = instr.quizAttemptN;
        subj.instrReadingTimes = JSON.stringify(instr.readingTimes);
        subj.quickReadingPageN = Object.values(instr.readingTimes).filter(d => d < INSTR_READING_TIME_MIN).length;
        subj.submitAnswers();
        $('#questionsBox').hide();
        exit_fullscreen();
        allow_selection();
        $('#debriefingBox').show();
        $('body').scrollTop(0);
    }
}

function show_hide_warnings(open_ended_names, choice_names) {
    let all_responded = true;
    for (let q of open_ended_names) {
        subj[q] = $('#'+q).val();
        if(!check_if_responded([subj[q]], [])){
            $('#'+q+'-warning').show();
            all_responded = false;
            $('body').scrollTop(0);
        }else{
            $('#'+q+'-warning').hide();
        }
    }
    for (let q of choice_names) {
        subj[q] = $('input[name='+q+']:checked').val();
        if(!check_if_responded([], [subj[q]])){
            $('#'+q+'-warning').show();
            all_responded = false;
            $('body').scrollTop(0);
        }else{
            $('#'+q+'-warning').hide();
        }
    }
    return all_responded;
}

function allow_selection() {
    $('body').css({
        '-webkit-user-select':'text',
        '-moz-user-select':'text',
        '-ms-user-select':'text',
        'user-select':'text'
    });
}

function go_to_completion_page() {
    window.location.href = COMPLETION_URL+subj.id;
}

let subj_options = {
    titles: SUBJ_TITLES,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    subjNumCallback: update_task_object_subj_num,
    subjNumScript: SUBJ_NUM_SCRIPT,
    savingScript: SAVING_SCRIPT,
    subjNumFile: SUBJ_NUM_FILE,
    visitFile: VISIT_FILE,
    attritionFile: ATTRITION_FILE,
    subjFile: SUBJ_FILE,
    savingDir: SAVING_DIR
};

//  ### #     #  #####  ####### ######  #     #  #####  ####### ### ####### #     #  #####
//   #  ##    # #     #    #    #     # #     # #     #    #     #  #     # ##    # #     #
//   #  # #   # #          #    #     # #     # #          #     #  #     # # #   # #
//   #  #  #  #  #####     #    ######  #     # #          #     #  #     # #  #  #  #####
//   #  #   # #       #    #    #   #   #     # #          #     #  #     # #   # #       #
//   #  #    ## #     #    #    #    #  #     # #     #    #     #  #     # #    ## #     #
//  ### #     #  #####     #    #     #  #####   #####     #    ### ####### #     #  #####

var instr_text = new Array;
instr_text[0] = "<strong>Welcome!</strong><br /><br />We are a group of cognitive scientists researching human actions, and we are studying how people view other people's interactions.";
instr_text[1] = "Your contributions may help in designing robots and making animations in movies or video games!<br /><br />And, most importantly, we hope this is fun for you, too!";
instr_text[2] = "This experiment will take about 60 minutes to complete.<br /><br />Please help us by reading the instructions in the next few pages carefully, and avoid using the refresh or back buttons.";
instr_text[3] = "For this study to work, the webpage will automatically switch to the fullscreen view on the next page. Please stay in the fullscreen mode until the study automatically switches out from it.";
instr_text[4] = "Please also turn off any music you are playing. Music is known to affect my kind of studies and it will make your data unusable.";
instr_text[5] = "In this experiment, we will show you some simple animations of two triangles interacting with each other, depicting some human interactions, just like the one in the example below.<br><br>A big triangle representing a bigger person is pushing the small triangle representing a smaller person.";
instr_text[6] = "You will complete two tasks in this experiment. And each task contains 27 trials. In both tasks, an animation video will show up first. You may click to play the video as many times as you like.";
instr_text[7] = "In the first task, you will be shown one video. Once you finish playing the video, you will be asked to rate on a scale of 1-5 whether the video is a social video.";
instr_text[8] = "You will proceed to the second task once you finish the first task.";
instr_text[9] = "In the second task, 27 labels will show up after you have played the video. And your job is to select the label that best describes the animation. After clicking on the label, a comment box will show up, and you will describe the reason of your selection."; 
instr_text[10] = "Let's try it once on the next page!";
instr_text[11] = "";
instr_text[12] = "I hope that was clear!<br /><br />By the way, you don't need to spend too much time thinking about what to choose. Just follow your intuition.";
instr_text[13] = "One last thing: Please make sure you make you choose based on the content of the animations and not the length or duration of them."
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
    6: HIDE_EXAMPLE_ANIMATION,
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
    $('#instrImg').attr('src', STIM_PATH + file_name);
    $('#instrImg').css('display', 'block');
}

function HIDE_INSTR_IMG() {
    $('#instrImg').css('display', 'none');
}

function PREPARE_TRIAL() {
    trial_options["subj"] = subj;
    test = new trialObject(trial_options);
    test.trialN = TRIAL_INPUT.length;
}

function SHOW_MAXIMIZE_WINDOW() {
    SHOW_INSTR_IMG('maximize_window.png');
}

function SHOW_NO_MUSIC() {
    if (subj.num == 'pre-post') {
        subj.obtainSubjNum();
    }
    enter_fullscreen();
    SHOW_INSTR_IMG('no_music.png');
}

function SHOW_EXAMPLE_ANIMATION() {
    HIDE_INSTR_IMG();
    $('#instrVid').css('display', 'block');
    $('#instrVid')[0].play();
    // $('#bufferVid1').attr('src', "stim/" + INSTR_PRAC_LIST[0] + STIM_TYPE);
    // buffer_video($('#bufferVid1')[0], "stim/" + INSTR_PRAC_LIST[0] + STIM_TYPE); // load first trial's videos
}

function HIDE_EXAMPLE_ANIMATION() {
    $('#instrVid').hide();
}

function SHOW_PRACTICE() {
    // one trial
    pratice = true;
    PREPARE_TRIAL();
    $('#instrBox').hide();
    $('#vid').attr('src', "stim/" + INSTR_PRAC_LIST[0] + STIM_TYPE); // first video
    // $('#vid1')[0].load();
    $('#stimuliBox .vid').on('ended', instr_practice_check_play_count);
    $('#stimuliBox .vid').on('mouseup', instr_practice_play);
    $('#taskBox').show();
    instr.vidPlayCounts = {
        'vid': 0,
    }
}

function instr_practice_play(ele) {
    $('.vid').off('mouseup');
    DISABLE_HOVER_EFFECT();
    let target = $(ele.target).closest('.vid');
    target[0].play();
}

function instr_practice_check_play_count(ele) {
    $(ele.target)[0].currentTime = 0
    $(ele.target).css("border-color","#9D8F8F");
    ENABLE_HOVER_EFFECT();
    $('.vid').on('mouseup', instr_practice_play);
    instr.vidPlayCounts[$(ele.target).attr('id')] += 1;
}

function BACK_TO_INSTRUCTIONS() {
    $('#taskBox').hide();
    $('#stimuliBox .vid').off('ended');
    $('#stimuliBox .vid').off('mouseup');
    // $("#stimuliBox .vid").css("border-color", "black");
    $('#instrBox').show();
    instr.next();
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
        instr.quizAttemptN += 1;
        instr.saveReadingTime();
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
            instr.saveReadingTime();
            $('#instrBox').hide();
            subj.saveAttrition();
            show_trial();
        }
    });
    buffer_video($('#bufferVid1')[0], test.stimSource + test.trialInput[test.trialIndex][0] + test.stimType); // load first trial's videos
}

var instr_options = {
    text: instr_text,
    funcDict: INSTR_FUNC_DICT,
};

//  ####### ######  ###    #    #
//     #    #     #  #    # #   #
//     #    #     #  #   #   #  #
//     #    ######   #  #     # #
//     #    #   #    #  ####### #
//     #    #    #   #  #     # #
//     #    #     # ### #     # #######

function show_trial() {
    $('#taskBox').show();
    subj.detectVisibilityStart();
    test.init();
}

function end_task() {
    subj.detectVisibilityEnd();
    $('#taskBox').hide();
    $('#questionsBox').show();
}

function UPDATE_STIMULI() { // array 
    test.startTime = Date.now();
    $("#progress").html( test.trialIndex + ' / ' + test.trialN + " completed");
    test.exptId = test.randomizedExptIDList[test.trialIndex]; // vid list index
    // $('#vid').attr('src', test.stimSource + test.exptId);
    $('#vid').attr('src', test.stimSource + test.exptId + test.stimType);
    $('#stimuliBox .vid').on('ended', CHECK_PLAY_COUNT);
    $('#stimuliBox .vid').on('mouseup', PLAY);
    let nextTrialIndex = test.trialIndex + 1;
    if (nextTrialIndex != test.trialN) { // XXX need to add this after Yiling figures out the trial list input method
        let nextExptId = test.randomizedExptIDList[test.trialIndex + 1];
        buffer_video($('#bufferVid1')[0], test.stimSource + nextExptId + test.stimType); // load next trial's videos
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
}

function SUBMIT_RESPONSE(label, index) {
    test.decideTime = Date.now();
    test.vidPlayCountsLabel = playTime;
    playTimeL = playTime;
    $("#stimuliBox .vid").css("border-color", "black");
    $("#stimuliBox .vid").hide();
    test.record(label, index);
    $('#commentbox').show();
    $(".selectionContainer").hide();
}

function SUBMIT_COMMENT(comment) {
    test.decideTime = Date.now();
    test.vidPlayCountsComment = playTime - playTimeL;
    test.recordC(comment);
}

function RESET_TRIAL_INTERFACE() {
    UPDATE_STIMULI(); 
    test.startTime = Date.now();
}

const TRIAL_TITLES = [
    "subjNum",
    "subjStartDate",
    "subjStartTime",
    "exptVer",
    "trialIndex",
    "exptId",

    "label",
    "labelIndex",
    "comment",
    "rtLabel",
    "rtComment",
    "vidPlayCountsLabel",
    "vidPlayCountsComment"
];


////////////////////////////
// button click functions //
////////////////////////////

function trial_done() {
    if (practice) {
        $('#survey-box').hide();
        $("#prompt").show();
        $("#prompt").html("For the second task, select the label that best describes the animation");
        $(".selectionContainer").show();
        return;
    }
    if ($('input[name="rating"]:checked').length > 0){
        $('#trial-container').hide(); 
        $('#survey-box').hide(); 
        $('#vid-next-button').hide();
        $('#next-instr-box').show();
        $('#video-instr').html('Please press play to watch the video.');
        $('#required-warning').html('');
        $('#play-button').show(); 
        $('#replay-button').hide();
        $('#submit-rating').hide();
        $('#q1').trigger("reset");    //clear the forms when the trial is done 
    }
    else {
        $('#required-warning').html('Please select a response before moving on.'); 
    }
}

function clickNext(selection) {
    if (document.querySelector('#vid').currentTime != 0) {
        return;
    }

    SUBMIT_RESPONSE(SHUFFLED_LABEL[selection], selection);
    $("#prompt").html("Explain why this label best describes the animation");
    $('#commentbox').show();
    $(".selectionContainer").hide();
}

function clickSubmit() {
    if (test.trialIndex >= VID_LIST.length - 1) {
        $('#commentbox').hide();
        $("#prompt").html("  ");
        test.save();
        end_task();
        return;
    }

    // if empty
    if (document.getElementById('comment').value == '') {
        return;
    }

    // end of practice trial
    if (practice) {
        playTime = 0;
        $("#taskBox").hide();
        $('#instrBox').show();
        $("#commentbox").hide();
        $("#prompt").html("  ");
        document.getElementById('comment').value = '';
        practice = false;
        instr.next();
        BACK_TO_INSTRUCTIONS; 
        return;
    }

    // submits the response
    SUBMIT_COMMENT(document.getElementById('comment').value); // trial object
    document.getElementById('comment').value = '';
    $('#commentbox').hide();
    $("#prompt").html("  ");
    playTime = 0;
    playTimeL = 0;
    test.update();
}

function clickReplay() {
    if (document.querySelector('#vid').currentTime == 0) {
        playTime ++;
        document.querySelector('#vid').play();
    }
    else {
        return;
    }
} 

var vid = document.getElementById("vid");
    vid.onended = function() {
        vid.currentTime = 0;
        if (playTime == 1) {
            if (practice) {
                $("#prompt").show();
                $("#prompt").html("For the first task, rate the social interation of this video (click video to replay)");
                $("#survey-box").show();
                return;
            }
            $("#prompt").show();
            $("#prompt").html("Select the label that best describes the animation");
            $(".selectionContainer").show();
        }
};

var trial_options = {
    subj: 'pre-define',
    titles: TRIAL_TITLES,
    dataFile: TRIAL_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    stimSource: STIM_PATH + STIM_SOURCE,
    stimType: STIM_TYPE,
    trialInput: TRIAL_INPUT,
    intertrialInterval: INTERTRIAL_INTERVAL,
    //updateFunc: TRIAL_UPDATE,
    //trialFunc: TRIAL,
    endExptFunc: end_task
}

