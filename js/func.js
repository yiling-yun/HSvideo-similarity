//  ####### ####### ######  #     #    #    #######
//  #       #     # #     # ##   ##   # #      #
//  #       #     # #     # # # # #  #   #     #
//  #####   #     # ######  #  #  # #     #    #
//  #       #     # #   #   #     # #######    #
//  #       #     # #    #  #     # #     #    #
//  #       ####### #     # #     # #     #    #

function list_to_formatted_string(data_list, divider) {
    divider = (divider === undefined) ? '\t' : divider;
    let list = data_list.slice();
    let string = '';
    let last = list.pop();
    for (let d of list) {
        string += d + divider;
    }
    string += last + '\n';
    return string;
}

function format_date(date_obj, time_zone, divider, padded) {
    date_obj = (date_obj === undefined) ? new Date() : date_obj;
    time_zone = (time_zone === undefined) ? 'UTC' : time_zone;
    divider = (divider === undefined) ? '.' : divider;
    padded = (padded === undefined) ? true : padded;
    const NOW_YEAR = (time_zone == 'UTC') ? date_obj.getUTCFullYear() : date_obj.getFullYear();
    let now_month = (time_zone == 'UTC') ? date_obj.getUTCMonth()+1 : date_obj.getMonth()+1;
    let now_date = (time_zone == 'UTC') ? date_obj.getUTCDate() : date_obj.getDate();
    if (padded) {
        now_month = ('0' + now_month).slice(-2);
        now_date = ('0' + now_date).slice(-2);
    }
    return NOW_YEAR + divider + now_month + divider + now_date;
}

function format_time(date_obj, time_zone, divider, padded) {
    date_obj = (date_obj === undefined) ? new Date() : date_obj;
    time_zone = (time_zone === undefined) ? 'UTC' : time_zone;
    divider = (divider === undefined) ? ':' : divider;
    padded = (padded === undefined) ? true : padded;
    let now_hours = (time_zone == 'UTC') ? date_obj.getUTCHours() : date_obj.getHours();
    let now_minutes = (time_zone == 'UTC') ? date_obj.getUTCMinutes() : date_obj.getMinutes();
    let now_seconds = (time_zone == 'UTC') ? date_obj.getUTCSeconds() : date_obj.getSeconds();
    if (padded) {
        now_hours = ('0' + now_hours).slice(-2);
        now_minutes = ('0' + now_minutes).slice(-2);
        now_seconds = ('0' + now_seconds).slice(-2);
    }
    return now_hours + divider + now_minutes + divider + now_seconds;
}

// ########  ########  #######  ######## ##     ##  ######  ########
// ##     ## ##       ##     ## ##       ##     ## ##    ##    ##
// ##     ## ##       ##     ## ##       ##     ## ##          ##
// ########  ######   ##     ## ######   ##     ##  ######     ##
// ##   ##   ##       ##  ## ## ##       ##     ##       ##    ##
// ##    ##  ##       ##    ##  ##       ##     ## ##    ##    ##
// ##     ## ########  ##### ## ########  #######   ######     ##

function get_parameters(var_name, default_value) {
    const REGEX_STRING = "[\?&]" + var_name + "=([^&#]*)";
    const REGEX = new RegExp(REGEX_STRING);
    const URL = location.href;
    const RESULTS = REGEX.exec(URL);
    if (RESULTS == null) {
        return default_value;
    } else {
        return RESULTS[1];
    }
}

function post_data(page, data, success_func, error_callback) {
    data = (data === undefined) ? null : data;
    success_func = (success_func === undefined) ? function() {return; } : success_func;
    error_callback = (error_callback === undefined) ? function() { return; } : error_callback;
    $.ajax({
        type: "POST",
        url: page,
        data: data,
        success: success_func,
        error: error_callback
    });
}

//    ###    ########  ########     ###    ##    ##
//   ## ##   ##     ## ##     ##   ## ##    ##  ##
//  ##   ##  ##     ## ##     ##  ##   ##    ####
// ##     ## ########  ########  ##     ##    ##
// ######### ##   ##   ##   ##   #########    ##
// ##     ## ##    ##  ##    ##  ##     ##    ##
// ##     ## ##     ## ##     ## ##     ##    ##

function shuffle_array(input_array) {
    let j, temp;
    let arr = Array.from(input_array);
    for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

//   #####  ####### #     # ####### ####### #     # #######
//  #     # #     # ##    #    #    #       ##    #    #
//  #       #     # # #   #    #    #       # #   #    #
//  #       #     # #  #  #    #    #####   #  #  #    #
//  #       #     # #   # #    #    #       #   # #    #
//  #     # #     # #    ##    #    #       #    ##    #
//   #####  ####### #     #    #    ####### #     #    #

function list_from_attribute_names(obj, string_list) {
    let list = []
    for (let s of string_list) {
        list.push(obj[s]);
    }
    return list;
}

function check_if_responded(open_ended_list, choice_list) {
    let all_responded = true;
    for (let i of open_ended_list) {
        all_responded = all_responded && (i.replace(/(?:\r\n|\r|\n|\s)/g, '') != '');
    }
    for (let j of choice_list) {
        all_responded = all_responded && (typeof j !== 'undefined');
    }
    return all_responded;
}