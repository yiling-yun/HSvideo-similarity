// ######## ##     ## ########  ########
// ##        ##   ##  ##     ##    ##
// ##         ## ##   ##     ##    ##
// ######      ###    ########     ##
// ##         ## ##   ##           ##
// ##        ##   ##  ##           ##
// ######## ##     ## ##           ##

// data saving
const FORMAL = false;
const EXPERIMENT_NAME = 'HSvideo';
const SUBJ_NUM_SCRIPT = 'php/subjNum.php';
const SAVING_SCRIPT = 'php/save.php';
const VISIT_FILE = 'visit_' + EXPERIMENT_NAME + '.txt';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME + '.txt';
const TRIAL_FILE = "trial_" + EXPERIMENT_NAME + ".txt";
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const SAVING_DIR_HOME = '/var/www-data-experiments/cvlstudy_data/YY/'+EXPERIMENT_NAME+'/';
const SAVING_DIR = FORMAL ? SAVING_DIR_HOME+'/formal_ratingLabeling' : SAVING_DIR_HOME+'/testing_ratingLabeling';
const ID_GET_VARIABLE_NAME = 'id';
const COMPLETION_URL = 'https://ucla.sona-systems.com/webstudy_credit.aspx?experiment_id=2320&credit_token=8610357a2fb040cb9a68edfb2162a54f&survey_code=';


// stimuli
const STIM_PATH = 'stim/';
const ALL_IMG_LIST = ['blank.png','maximize_window.png','no_music.png','ucla.png'];
const STIM_TYPE = '.mp4';
const INTERTRIAL_INTERVAL = 500; //ms
const STIM_SOURCE = 'greyed/';
const EXPT_N = 65;


const TRIANGLES_COLOR_LIST = [
    //pathways to the images of the gray/black triangles being used as the buttons
    'stim/dark_triangle.png',
    'stim/light_triangle.png'
    //for light dominant, dark triangle is on the left. for dark dominant, dark triangle on the right.
];
const TRIANGLES_COLOR_DICT = {
    0:'dark', 1:'light'
};

var practice = true;
var playTime = 0;
var playTimeL = 0;
var indexVid = 0;
// var trial1 = true;

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

    subj = new Subject(subj_options);
    //subj.id = subj.getID(ID_GET_VARIABLE_NAME);
    subj.saveVisit();
    
    if (subj.phone) {
        halt_experiment('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at yiling.yun@g.ucla.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
    } else { //if (subj.validID)
        load_img(0, STIM_PATH, ALL_IMG_LIST);
        instr = new instrObject(instr_options);
        instr.start();        
        practice = true;
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
instr_text[0] = "<strong>Welcome!</strong><br /><br />We are a group of cognitive scientists researching human actions, <br />and we are studying how people view other people's interactions.";
instr_text[1] = "Your contributions may help in designing robots and making animations in movies or video games!<br /><br />And, most importantly, we hope this is fun for you, too!";
instr_text[2] = "This experiment will take about 1 hour to complete.<br /><br />Please help us by reading the instructions in the next few pages carefully, <br />and avoid using the refresh or back buttons.";
instr_text[3] = "For this study to work, the webpage will automatically switch to the fullscreen view on the next page. Please stay in the fullscreen mode until the study automatically switches out from it.";
instr_text[4] = "Please also turn off any music you are playing. <br />Music is known to affect my kind of studies, and it will make your data unusable.";
instr_text[5] = "In this experiment, you will see some simple animations of two triangles interacting with each other, just like the one in the example below.";
instr_text[6] = "In each trial, a video will show up, and you will click the video to play.";
instr_text[7] = "Once you finish watching the video, you will answer a question.";
instr_text[8] = "In these questions, we will ask you to identify which triangle is the agent.<br/><br/> What do we mean by being the 'agent'? Let's look at some examples."; 
instr_text[9] = "<strong>A boy kicks the ball.</strong> <br/><br/> Which one is the agent, the boy or the ball?";
instr_text[10] = "The boy is the agent here because he actively takes the action that has an effect on the ball. <br/><br/> The ball is the target because it is being acted upon.";
instr_text[11] = "<strong>Helen picks up a book. </strong><br/><br/> Which one is the agent, Helen or the book?"; 
instr_text[12] = "Helen is the agent here because she actively takes the action. <br/><br/> The book is the target because its state was changed by Helen's action.";
instr_text[13] = "In this video, which is the agent? <br/><br/> Click the video to watch."; 
instr_text[14] = "The red square is the agent because it initiates the movement and causes the green square to move by bumping into it.";
instr_text[15] = "I hope that was clear!<br /><br />By the way, you don't need to spend too much time thinking about what to choose. Just follow your intuition.";
instr_text[16] = "You may click on the video to watch the video as many times as you like.";
instr_text[17] = "The next page is a quick instruction quiz. (It's very simple!)";
instr_text[18] = "";
instr_text[19] = "Great! You can press SPACE to start. Please focus after you start. (Don't switch to other windows or tabs!)";

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
    11: SHOW_INSTR,
    12: SHOW_INSTR,
    13: SHOW_PRACTICE,
    14: SHOW_INSTR,
    15: END_PRACTICE,
    16: SHOW_INSTR,
    17: SHOW_INSTR,
    18: SHOW_INSTR_QUIZ, 
    19: SHOW_CONSENT,
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
    if (test.trialInput[test.trialIndex].agent == 'light'){ 
        $('#left_triangle').attr('src', TRIANGLES_COLOR_LIST[0]) //0 is dark, 1 is light
        $('#right_triangle').attr('src', TRIANGLES_COLOR_LIST[1])
    }
    else {
        $('#left_triangle').attr('src', TRIANGLES_COLOR_LIST[1])
        $('#right_triangle').attr('src', TRIANGLES_COLOR_LIST[0])
    }
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
    trial_options["subj"] = subj;
    test = new trialObject(trial_options);
    fetchVideoData(test);
}

function SHOW_EXAMPLE_ANIMATION() {
    HIDE_INSTR_IMG();
    $('#instrVid').css('display', 'block');
    $('#instrVid')[0].play();
}

function HIDE_EXAMPLE_ANIMATION() {
    $('#instrVid').hide();
}

function SHOW_PRACTICE() {
    // one trial
    practice = true;

    $('#pracBox').show();
    $('#pracVid').on('ended', instr_practice_check_play_count);
    $('#pracVid').on('mouseup', instr_practice_play);
    instr.vidPlayCounts = {
        'vid': 0,
    }
}

function END_PRACTICE(){
    $('#pracBox').hide();
    practice = false;
    playTime = 0;
    SHOW_INSTR();
}

function instr_practice_play(ele) {
    $('.vid').off('mouseup');
    DISABLE_HOVER_EFFECT();
    if (practice) {
        document.querySelector('#pracVid').play(); 
        return;
    }
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
        practice = true;
        playTime = 0;
        $("#prompt").html("Click on the video to play");
        $('#q1').trigger("reset");
        $('#quizBox').hide();
        $('#instrText').text('You have given an incorrect answer. Please read through the instructions again.');
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
} //test.stimSource = folder /stim/greyed 

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
    $('#vid').attr('src', test.stimSource+ test.trialInput[test.trialIndex].agent +'/' + test.trialInput[test.trialIndex].id +'_' + test.trialInput[test.trialIndex].label + test.stimType);

    PREPARE_TRIAL();
    $('#stimuliBox .vid').on('ended', CHECK_PLAY_COUNT);
    $('#stimuliBox .vid').on('mouseup', PLAY);
    let nextTrialIndex = test.trialIndex + 1;
    if (nextTrialIndex != test.trialN) { // XXX need to add this after Yiling figures out the trial list input method
        //let nextExptId = test.randomizedExptIDList[test.trialIndex + 1];
        buffer_video($('#bufferVid1')[0], test.stimSource + test.trialInput[nextTrialIndex].agent +'/' + test.trialInput[nextTrialIndex].id +'_' + test.trialInput[nextTrialIndex].label + test.stimType); // load next trial's videos
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

function SUBMIT_AGENT(agent) { 
    test.decideTime = Date.now(); 
    test.vidPlayCountsAgent = playTime; 
    test.recordA(agent);
}

function SUBMIT_RATING(rating) {
    test.decideTime = Date.now();
    test.vidPlayCountsRating = playTime;
    test.recordR(rating);
}

function SUBMIT_RESPONSE(label, index) {
    test.decideTime = Date.now();
    test.vidPlayCountsLabel = playTime;
    playTimeL = playTime;
    $("#stimuliBox .vid").css("border-color", "black");
    $("#stimuliBox .vid").hide();
    test.recordL(label, index);
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
    "trialIndex",
    "exptId",

    "agent", //which one was clicked by the participant
    "chosenTriangle", //which triangle that was
    "intendedAgent",
    "rtAgent",
    "vidPlayCountsAgent",
];


////////////////////////////
// button click functions //
////////////////////////////

function trial_done(choice) {
    if (test.trialIndex >= VIDEOS_TABLE.length - 1) {
        if (choice == 'left') {
            SUBMIT_AGENT('left');
        }
        else if (choice == 'right') {
            SUBMIT_AGENT('right');
        }
        $("#prompt").html("  ");
        test.save();
        end_task();
        return;
    }

    if (choice != undefined){
        if (choice == 'left') {
            SUBMIT_AGENT('left');
        } 
        else if (choice == 'right') {
            SUBMIT_AGENT('right');
        }
        $('#trial-container').hide();
        $('#survey-box').hide();
        $('#required-warning').html('');
        $("#prompt").hide();
        playTime = 0;
        test.update();
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

// function clickSubmit() {
//     if (test.trialIndex >= (test.trialN - 1)) {
//         SUBMIT_COMMENT(document.getElementById('comment').value); // trial object
//         document.getElementById('comment').value = '';
//         $('#commentbox').hide();
//         $("#prompt").html("  ");
//         test.save();
//         end_task();
//         return;
//     }

//     // if empty
//     if (document.getElementById('comment').value == '') {
//         $('#comment-warning').html('Please write down the explanation for your selection.');
//         return;
//     }

//     // submits the response
//     SUBMIT_COMMENT(document.getElementById('comment').value); // trial object
//     document.getElementById('comment').value = '';
//     $('#commentbox').hide();
//     $("#prompt").html("  ");
//     $('#comment-warning').html(' ');
//     playTime = 0;
//     playTimeL = 0;
//     test.update();
// }

function clickReplay() {
    if (practice){
        if (document.querySelector('#pracVid').currentTime == 0) {
            playTime ++;
            document.querySelector('#pracVid').play();
        }
        else {
            return;
        }
    }
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
                $("#prompt").html("In the video, which one is the agent?");
                $("#survey-box").show();
                return;
            }
            else {
                $("#prompt").show();
                $("#prompt").html("In the video, which one is the agent? (click on the video to replay)");
                $("#survey-box").show();
                return;
            }
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
    trialInput: VIDEOS_TABLE,
    intertrialInterval: INTERTRIAL_INTERVAL,
    //updateFunc: TRIAL_UPDATE,
    //trialFunc: TRIAL,
    endExptFunc: end_task
}

