class Subject {
    constructor(options = {}) {
        Object.assign(this, {
            num: 'pre-post',
            subjNumScript: '',
            subjNumCallback: () => void 0,
            savingScript: '',
            subjNumFile: '',
            visitFile: 'visit.txt',
            attritionFile: 'attrition.txt',
            subjFile: 'subj.txt',
            savingDir: 'data/testing',
            condition: false,
            conditionList: [''],
            titles: [''],
            viewportMinW: 0,
            viewportMinH: 0
        }, options);
        if (this.num == 'pre-post') {
            this.obtainSubjNum();
        }
        this.data = list_to_formatted_string(this.titles);
        this.dateObj = new Date();
        this.date = format_date(this.dateObj, 'UTC', '-', true);
        this.startTime = format_time(this.dateObj, 'UTC', ':', true);
        this.userAgent = window.navigator.userAgent;
        this.hiddenCount = 0;
        this.hiddenDurations = [];
    }

    obtainSubjNum() {
        let that = this;
        function subj_num_update_succeeded(number) {
            that.num = number;
            that.subjNumCallback();
            if (that.condition == 'auto') {
                that.assignCondition();
            }
        }
        function subj_num_update_failed() {
            that.num = -999;
            that.subjNumCallback();
        }
        post_data(this.subjNumScript, { 'directory_path': this.savingDir, 'file_name': this.subjNumFile }, subj_num_update_succeeded, subj_num_update_failed);
    }

    assignCondition() {
        let that = this;
        const check_subj_num = function(){
            if(that.num != 'pre-post'){
                clearInterval(interval_id);
                that.condition = that.conditionList[(that.num-1) % that.conditionList.length];
                that.conditionAssigned = true;
            }
        };
        let interval_id = setInterval(check_subj_num, 10);
    }

    saveVisit() {
        let data = 'subjNum\tstartDate\tstartTime\tid\tuserAgent\tinView\tviewportW\tviewportH\n';
        this.viewport = this.viewportSize;
        this.inView = this.viewport['inView'];
        this.viewportW = this.viewport['w'];
        this.viewportH = this.viewport['h'];
        let dataList = [this.num, this.date, this.startTime, this.id, this.userAgent, this.inView, this.viewportW, this.viewportH];
        data += list_to_formatted_string(dataList);
        post_data(this.savingScript, { 'directory_path': this.savingDir, 'file_name': this.visitFile, 'data': data });
    }

    getID(get_variable) {
        let id = get_parameters(get_variable, null);
        this.validID = this.checkID(id);
        if (this.validID) {
            return id;
        } else {
            return null;
        }
    }

    checkID(id) {
        let valid_id = (id !== null);
        if (valid_id) {
            id = id.replace(/\s+/g, '');
            valid_id = (id !== '');
        }
        return valid_id;
    }

    get phone() {
        let md = new MobileDetect(this.userAgent);
        return md.mobile() ? true : false;
    }

    get viewportSize() {
        let w = $(window).width();
        let h = $(window).height();
        let inView = (w >= this.viewportMinW) && (h >= this.viewportMinH);
        return { 'h': h, 'w': w, 'inView': inView };
    }

    saveAttrition() {
        let data = 'subjNum\tstartDate\tstartTime\tid\tuserAgent\tinView\tviewportW\tviewportH\n';
        this.viewport = this.viewportSize;
        this.inView = this.viewport['inView'];
        this.viewportW = this.viewport['w'];
        this.viewportH = this.viewport['h'];
        let dataList = [this.num, this.date, this.startTime, this.id, this.userAgent, this.inView, this.viewportW, this.viewportH];
        data += list_to_formatted_string(dataList);
        post_data(this.savingScript, { 'directory_path': this.savingDir, 'file_name': this.attritionFile, 'data': data });
    }

    submitAnswers() {
        let endTimeObj = new Date();
        this.endTime = format_time(endTimeObj, 'UTC', ':', true);
        this.duration = (endTimeObj - this.dateObj) / 60000;
        let dataList = list_from_attribute_names(this, this.titles);
        this.data += list_to_formatted_string(dataList);
        post_data(this.savingScript, { 'directory_path': this.savingDir, 'file_name': this.subjFile, 'data': this.data });
    }

    detectVisibilityStart() {
        let that = this;
        document.addEventListener('visibilitychange', that.handleVisibilityChange);
    }

    detectVisibilityEnd() {
        let that = this;
        document.removeEventListener('visibilitychange', that.handleVisibilityChange);
    }

    handleVisibilityChange = () => {
        if (document.hidden) {
            this.hiddenCount += 1;
            this.hiddenStartTime = Date.now();
        } else  {
            this.hiddenDurations.push((Date.now() - this.hiddenStartTime)/1000);
        }
    }
}