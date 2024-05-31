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
                // updateFunc: false,
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
        this.vidPlayCounts = 0;
    }

    init(){
        // this.randomizedExptIDList = Object.keys(this.trialInput); //
        this.randomizedExptIDList = this.trialInput;
        UPDATE_STIMULI();
        this.startTime = Date.now();
    }

    recordA(agent) {
        this.rtAgent = (this.decideTime - this.startTime)/1000; 
        this.agent = agent; //this is left or right 
        this.vidPlayCountsAgent = JSON.stringify(this.vidPlayCountsAgent); 
        this.intendedAgent = this.trialInput[this.trialIndex].agent; 
        if (agent == 'left'){
            if (this.intendedAgent == 'light'){
                this.chosenTriangle = 'dark'; 
            }
            else {
                this.chosenTriangle = 'light';
            }
        }
        else {
            if (this.intendedAgent == 'light'){
                this.chosenTriangle = 'light';
            }
            else {
                this.chosenTriangle = 'dark';
            }
        }     
        this.exptId = this.randomizedExptIDList[this.trialIndex].id + '_' + this.randomizedExptIDList[this.trialIndex].label;
        var dataList = list_from_attribute_names(this, this.titles); 
        this.allData += list_to_formatted_string(dataList, ";");
    }

    update(){
        this.trialIndex++;
        if (this.trialIndex == this.trialN){
            this.endExptFunc();
        } else {
            this.vidPlayCounts = 0;
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

