// ######## ##     ## ########  ########
// ##        ##   ##  ##     ##    ##
// ##         ## ##   ##     ##    ##
// ######      ###    ########     ##
// ##         ## ##   ##           ##
// ##        ##   ##  ##           ##
// ######## ##     ## ##           ##

// data saving
const FORMAL = false;
const EXPERIMENT_NAME = "HSvideo";
const SUBJ_NUM_SCRIPT = 'php/subjNum.php';
const SAVING_SCRIPT = 'php/save.php';
const VISIT_FILE = 'visit_' + EXPERIMENT_NAME + '.txt';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME + '.txt';
const TRIAL_FILE = "trial_" + EXPERIMENT_NAME + ".txt"; //const RATING_FILE = 'rating_' + EXPERIMENT_NAME + '.txt';
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const SAVING_DIR_HOME = "/var/www-data-experiments/cvlstudy_data/YY/";
const SAVING_DIR = FORMAL ? SAVING_DIR_HOME + EXPERIMENT_NAME + '/formal' : SAVING_DIR_HOME + EXPERIMENT_NAME + '/testing';
const ID_GET_VARIABLE_NAME = 'id';
const COMPLETION_URL = 'https://ycc.vision/'; //xxx: need to change to SONA


// stimuli
const STIM_TYPE = ".png";
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



// object variables
let subj, instr, task;

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
    // subj.id = subj.getID(ID_GET_VARIABLE_NAME);
    // subj.saveVisit();
    // if (subj.phone) {
    //     halt_experiment('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at yichiachen@ucla.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
    // } else if (subj.validID){
    //     load_img(0, STIM_PATH, ALL_IMG_LIST);
        instr = new instrObject(instr_options);
        instr.start();
        test = new trialObject(trial_options);
        test.init();
    // }
});

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
    'serious',
    'problems',
    'gender',
    'age',
    'inView',
    'viewportW',
    'viewportH'
];

function update_task_object_subj_num() {
    if (typeof task !== 'undefined'){
        task.num = subj.num;
    }
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

//  ####### ######  ###    #    #
//     #    #     #  #    # #   #
//     #    #     #  #   #   #  #
//     #    ######   #  #     # #
//     #    #   #    #  ####### #
//     #    #    #   #  #     # #
//     #    #     # ### #     # #######

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