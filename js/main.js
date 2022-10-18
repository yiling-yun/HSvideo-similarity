$(document).ready(function() {
    instr = new instrObject(instr_options);
    instr.start();
    test = new trialObject(trial_options);
    test.init();
});