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