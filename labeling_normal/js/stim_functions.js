// ########  #######  ########  ##     ##    ###    ########
// ##       ##     ## ##     ## ###   ###   ## ##      ##
// ##       ##     ## ##     ## #### ####  ##   ##     ##
// ######   ##     ## ########  ## ### ## ##     ##    ##
// ##       ##     ## ##   ##   ##     ## #########    ##
// ##       ##     ## ##    ##  ##     ## ##     ##    ##
// ##        #######  ##     ## ##     ## ##     ##    ##

function list_from_attribute_names(obj, string_list) {
    let list = []
    for (let s of string_list) {
        list.push(obj[s]);
    }
    return list;
}

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

function capitalize(s) {
    if (typeof s !== 'string'){
        return '';
    } else {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}

function array_to_formatted_string(data_list, divider) {
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

function two_d_array_to_string(input_array) {
    let arr = Array.from(input_array);
    for (let i=0; i<arr.length; i++){
        arr[i] = '[' + arr[i].toString() + ']';
    }
    return '[' + arr.toString() + ']';
}

function three_d_array_to_string(input_array) {
    let arr = Array.from(input_array);
    for (let i=0; i<arr.length; i++) {
        if (Array.isArray(arr[i])) {
            for (let j=0; j<arr[i].length; j++) {
                arr[i][j] = '[' + arr[i][j].toString() + ']';
            }
        } else {
            arr[i] = arr[i].toString();
        }
    }
    return '[' + arr.toString() + ']';
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


// ##     ##    ###    ######## ##     ##
// ###   ###   ## ##      ##    ##     ##
// #### ####  ##   ##     ##    ##     ##
// ## ### ## ##     ##    ##    #########
// ##     ## #########    ##    ##     ##
// ##     ## ##     ##    ##    ##     ##
// ##     ## ##     ##    ##    ##     ##

function to_radians(degrees) {
    return degrees * Math.PI / 180;
}

function to_degrees(radians) {
    return radians * 180 / Math.PI % 360;
}

function positive_mod(value, divider) {
    return ((value % divider) + divider) % divider;
}

function polar_to_cartesian(r, theta) {
    return [r * Math.cos(to_radians(theta)), r * Math.sin(to_radians(theta))];
}


//  ######   ########  #######  ##     ## ######## ######## ########  ##    ##
// ##    ##  ##       ##     ## ###   ### ##          ##    ##     ##  ##  ##
// ##        ##       ##     ## #### #### ##          ##    ##     ##   ####
// ##   #### ######   ##     ## ## ### ## ######      ##    ########     ##
// ##    ##  ##       ##     ## ##     ## ##          ##    ##   ##      ##
// ##    ##  ##       ##     ## ##     ## ##          ##    ##    ##     ##
//  ######   ########  #######  ##     ## ########    ##    ##     ##    ##

function distance_between_points(point_a, point_b){
    let x_diff = point_a[0] - point_b[0];
    let y_diff = point_a[1] - point_b[1];
    return vector_length(x_diff, y_diff);
}

function vector_length(x_diff, y_diff) {
    return Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
}

function midpoint_of_two_points(point_1, point_2) {
    return [(point_1[0]+point_2[0])/2, (point_1[1]+point_2[1])/2];
}

function slope_from_points(point_1, point_2) {
    let x_1 = point_1[0];
    let y_1 = point_1[1];
    let x_2 = point_2[0];
    let y_2 = point_2[1];
    return (y_2 - y_1)/(x_2 - x_1);
}

function y_intercept_from_points(point_1, point_2) {
    let x_1 = point_1[0];
    let y_1 = point_1[1];
    let x_2 = point_2[0];
    let y_2 = point_2[1];
    return (x_2*y_1 - x_1*y_2)/(x_2 - x_1);
}

function line_angle_to_x_axis(slope) {
    return to_degrees(Math.atan(slope)) % 360;
}

function intersection_of_two_lines(slope_1, y_intercept_1, slope_2, y_intercept_2) {
    let intersection_x = (y_intercept_2-y_intercept_1) / (slope_1-slope_2);
    let intersection_y = (slope_1*y_intercept_2 - slope_2*y_intercept_1) / (slope_1-slope_2);
    return [intersection_x, intersection_y];
}

function vertical_line_intersection_from_point_to_line(point_0, slope, y_intercept) {
    let x_0 = point_0[0];
    return [x_0, slope*x_0+y_intercept];
}

function horizontal_line_intersection_from_point_to_line(point_0, slope, y_intercept) {
    let y_0 = point_0[1];
    return [(y_0-y_intercept)/slope, y_0];
}

function point_to_line_distance(point_0, slope, y_intercept) {
    let intersection_x_point = vertical_line_intersection_from_point_to_line(point_0, slope, y_intercept);
    let intersection_y_point = horizontal_line_intersection_from_point_to_line(point_0, slope, y_intercept);
    let hypotenuse = distance_between_points(intersection_x_point, intersection_y_point);
    return intersection_x_point*intersection_y_point/hypotenuse;
}

function perpendicular_line_of_a_line_passing_a_point(point_0, slope) {
    let perpendicular_slope = -1/slope
    let y_intercept = point_0[1] - perpendicular_slope*point_0[0];
    return [perpendicular_slope, y_intercept];
}

function foot_of_perpendicular(point_0, slope, y_intercept) {
    let perpendicular_line = perpendicular_line_of_a_line_passing_a_point(point_0, slope)
    return intersection_of_two_lines(slope, y_intercept, perpendicular_line[0], perpendicular_line[1]);
}

function reflection_point_through_a_line(point_0, slope, y_intercept) {
    let foot = foot_of_perpendicular(point_0, slope, y_intercept);
    let foot_x = foot[0];
    let foot_y = foot[1];
    let x_0 = point_0[0];
    let y_0 = point_0[1];
    return [2*foot_x - x_0, 2*foot_y - y_0];
}

function perpendicular_bisector(point_1, point_2) {
    let midpoint = midpoint_of_two_points(point_1, point_2);
    let slope = -1/slope_from_points(point_1, point_2);
    let y_intercept = midpoint[1] - slope*midpoint[0];
    return [slope, y_intercept];
}


//    ###    ########  ########     ###    ##    ##
//   ## ##   ##     ## ##     ##   ## ##    ##  ##
//  ##   ##  ##     ## ##     ##  ##   ##    ####
// ##     ## ########  ########  ##     ##    ##
// ######### ##   ##   ##   ##   #########    ##
// ##     ## ##    ##  ##    ##  ##     ##    ##
// ##     ## ##     ## ##     ## ##     ##    ##

function range(start_num, end_num, interval) {
    start_num = (start_num === undefined) ? 0 : start_num;
    interval = (interval === undefined) ? 1 : interval;
    let list = [];
    for (let i = start_num; i < end_num; i += interval) {
        list.push(i);
    }
    return list;
}

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

function rand_choice(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function sample_wo_replacement(list, sample_n) {
    sample_n = (sample_n === undefined) ? 1 : sample_n;
    let sample = [];
    let local_list = list.slice(0);
    for (let i = 0; i < sample_n; i++) {
        let random_index = Math.floor(Math.random() * local_list.length);
        sample.push(local_list.splice(random_index, 1)[0]);
    }
    return {
        sample: sample,
        remainder: local_list
    };
}

function sample_w_replacement(list, sample_n) {
    sample_n = (sample_n === undefined) ? 1 : sample_n;
    let sample = [];
    let local_list = list.slice(0);
    for (let i = 0; i < sample_n; i++) {
        let random_index = Math.floor(Math.random() * local_list.length);
        sample.push(local_list[random_index]);
    }
    return sample;
}

function repeat_elements_in_array(arr, repeat_n) {
    let new_arr = [];

    for (let a of arr) {
        for (let j = 0; j < repeat_n; j++) {
            if (Array.isArray(a)) {
                new_arr.push(a.slice());
            } else {
                new_arr.push(a);
            }
        }
    }
    return new_arr;
}

function concat_duplicated_array(arr, repeat_n) {
    let new_arr = [];
    for (let i = 0; i < repeat_n; i++) {
        new_arr = new_arr.concat(arr.slice());
    }
    return new_arr;
}

function create_random_repeat_at_array_end(stim_list, repeat_trial_n) {
    let repeat_list = shuffle_array(stim_list.slice()).splice(0, repeat_trial_n);
    return stim_list.concat(repeat_list);
}

function recursive_combine(current_factor, remain_factor_list, conditions) {
    conditions = repeat_elements_in_array(conditions.slice(), current_factor.length);
    for (let j = 0; j < conditions.length; j += current_factor.length) {
        for (let k = 0; k < current_factor.length; k++) {
            let index = j + k;
            conditions[index].push(current_factor[k]);
        }
    }
    if (remain_factor_list.length !== 0) {
        current_factor = remain_factor_list.shift();
        return recursive_combine(current_factor, remain_factor_list, conditions);
    } else {
        return conditions.slice();
    }
}

function factorial_cond(factor_list) {
    let now_factor = factor_list.shift();
    let all_conditions = [];
    for (let f of now_factor) {
        all_conditions.push([f])
    }
    now_factor = factor_list.shift();
    all_conditions = recursive_combine(now_factor, factor_list, all_conditions);
    return all_conditions;
}


// ######## #### ##     ## ########
//    ##     ##  ###   ### ##
//    ##     ##  #### #### ##
//    ##     ##  ## ### ## ######
//    ##     ##  ##     ## ##
//    ##     ##  ##     ## ##
//    ##    #### ##     ## ########

function request_timeout(to_do, delay) {
    let start_time = Date.now();
    function loop() {
        let time_elapsed = Date.now() - start_time;
        if (time_elapsed >= delay) {
            to_do();
        } else {
            request_id = requestAnimationFrame(loop);
            register_cancel_function(function() {cancelAnimationFrame(request_id)});
        }
    }
    let request_id = requestAnimationFrame(loop);
    register_cancel_function(function() {cancelAnimationFrame(request_id)});
}

function request_cancel() {
    // register automatically
}

function register_cancel_function (func) {
    request_cancel = func;
}


// ########  ########  #######  ######## ##     ##  ######  ########
// ##     ## ##       ##     ## ##       ##     ## ##    ##    ##
// ##     ## ##       ##     ## ##       ##     ## ##          ##
// ########  ######   ##     ## ######   ##     ##  ######     ##
// ##   ##   ##       ##  ## ## ##       ##     ##       ##    ##
// ##    ##  ##       ##    ##  ##       ##     ## ##    ##    ##
// ##     ## ########  ##### ## ########  #######   ######     ##

function get_parameters(var_name, default_value) {
    let regex_string = "[\?&]" + var_name + "=([^&#]*)";
    let regex = new RegExp(regex_string);
    let url = location.href;
    let results = regex.exec(url);
    if (results == null) {
        return default_value;
    } else {
        return results[1];
    }
}

function post_data(page, data, success_func, error_callback) {
    data = (data === undefined) ? null : data;
    success_func = (success_func === undefined) ? function() { return; } : success_func;
    error_callback = (error_callback === undefined) ? function() { return; } : error_callback;
    $.ajax({
        type: "POST",
        url: page,
        data: data,
        success: success_func,
        error: error_callback
    });
}


// ##        #######     ###    ########  #### ##    ##  ######
// ##       ##     ##   ## ##   ##     ##  ##  ###   ## ##    ##
// ##       ##     ##  ##   ##  ##     ##  ##  ####  ## ##
// ##       ##     ## ##     ## ##     ##  ##  ## ## ## ##   ####
// ##       ##     ## ######### ##     ##  ##  ##  #### ##    ##
// ##       ##     ## ##     ## ##     ##  ##  ##   ### ##    ##
// ########  #######  ##     ## ########  #### ##    ##  ######

function add_prefix_to_array_of_string(strings, prefix) {
    let output_list = [];
    for (let s of strings) {
        output_list.push(prefix+s);
    }
    return output_list;
}

function load_img(index, stim_path, img_list, after_func) {
    after_func = (after_func === undefined) ? function() { return; } : after_func;
    if (index >= img_list.length) {
        return;
    }
    let image = new Image();
    if (index < img_list.length - 1) {
        image.onload = function() {
            load_img(index + 1, stim_path, img_list, after_func);
        };
    } else {
        image.onload = after_func;
    }
    image.src = stim_path + img_list[index];
}

function load_sounds(index, stim_path, sound_list, after_func) {
    if (index >= sound_list.length) {
        after_func();
        return;
    }

    let sound = new Audio();
    sound.src = stim_path + sound_list[index];
    let start_time = Date.now();
    let reload_num = 0;
    let check_loading = window.setInterval(check_state, 20);

    function check_state() {
        if (sound.readyState == 4) {
            clearInterval(check_loading);
            load_next_sound_or_run_after_func(index+1, stim_path, sound_list, after_func);
        } else {
            let current_duration = (Date.now() - start_time) / 1000;
            if (current_duration > 2) {
                clearInterval(check_loading);
                if (reload_num > 2) { // giving up
                    load_next_sound_or_run_after_func(index+1, stim_path, sound_list, after_func);
                } else { // try reloading again
                    reload_num++;
                    sound.load();
                    check_loading = window.setInterval(check_state, 20);
                }
            }
        }
    }
}

function load_next_sound_or_run_after_func(index, stim_path, sound_list, after_func) {
    if (index < sound_list.length) {
        load_sounds(index, stim_path, sound_list, after_func);
    } else {
        after_func();
    }
}

function buffer_video(buffer_element, filename, error_func, after_func) {
    error_func = (error_func === undefined) ? function() { return; } : error_func;
    after_func = (after_func === undefined) ? function() { return; } : after_func;
    let request = new XMLHttpRequest();
    request.open('GET', filename, true);
    request.responseType = 'blob';
    request.onload = function() {
        if (this.status === 200) {
            let video_blob = this.response;
            let video = URL.createObjectURL(video_blob);
            buffer_element.src = video;
            after_func();
        }
    };
    request.onerror = error_func;
    request.send();
}


//  ######   #######  ##    ## ######## ######## ##    ## ########
// ##    ## ##     ## ###   ##    ##    ##       ###   ##    ##
// ##       ##     ## ####  ##    ##    ##       ####  ##    ##
// ##       ##     ## ## ## ##    ##    ######   ## ## ##    ##
// ##       ##     ## ##  ####    ##    ##       ##  ####    ##
// ##    ## ##     ## ##   ###    ##    ##       ##   ###    ##
//  ######   #######  ##    ##    ##    ######## ##    ##    ##

function append_array_of_img(img_path_list, img_box) {
    let img;
    for (let p of img_path_list) {
        img = $(document.createElement('img'));
        img.attr('src', p);
        img.appendTo(img_box);
    }
}

function array_from_attribute_names(obj, string_list) {
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

function check_fully_in_view(el) {
    el = el.get(0);
    let rect = el.getBoundingClientRect();
    let top = rect.top;
    let bottom = rect.bottom;
    let left = rect.left;
    let right = rect.right;

    let W = $(window).width();
    let H = $(window).height();
    return (top >= 0) && (bottom <= H) && (left >= 0) && (right <= W);
}

function enter_fullscreen() {
    let el = document.documentElement;
    if (el.requestFullscreen) {
        el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    } else {
        el.msRequestFullscreen();
    }
}

function exit_fullscreen() {
    let el = document;
    if (el.exitFullscreen) {
        el.exitFullscreen();
    } else if (el.mozCancelFullScreen) {
        el.mozCancelFullScreen();
    } else if (el.webkitExitFullscreen) {
        el.webkitExitFullscreen();
    } else {
        el.msExitFullscreen();
    }
}
