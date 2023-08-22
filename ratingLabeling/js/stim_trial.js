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

    recordR(rating) {
        this.rtRating = (this.decideTime - this.startTime)/1000;
        this.rating = rating;
        this.vidPlayCountsRating = JSON.stringify(this.vidPlayCountsRating);
        var dataList = list_from_attribute_names(this, this.titles);
        this.allData += list_to_formatted_string(dataList, ";");
        // this.save();
    }

    recordL(label, index){
        this.rtLabel = (this.decideTime - this.startTime)/1000;
        this.label = label;
        this.labelIndex = index;
        this.vidPlayCountsLabel = JSON.stringify(this.vidPlayCountsLabel);
        this.startTime = Date.now();
    }

    recordC(comment) {
        this.rtComment = (this.decideTime - this.startTime)/1000;
        this.comment = comment;
        this.vidPlayCountsComment = JSON.stringify(this.vidPlayCountsComment);
        var dataList = list_from_attribute_names(this, this.titles);
        this.allData += list_to_formatted_string(dataList, ";");
        // this.save();
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

