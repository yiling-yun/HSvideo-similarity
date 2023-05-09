<?php
    $directory_path = $_POST['directory_path'];
    $file_path = $directory_path . '/' . $_POST['file_name'];

    if (is_file($file_path)) {
        $subj_num_file = fopen($file_path, 'r');
        $subj_num = fgets($subj_num_file) + 1;
        fclose($subj_num_file);
    } else {
        $subj_num = 1;
    }
    echo $subj_num;

    if (!is_dir($directory_path)) {
        mkdir($directory_path, 0777, true);
    }
    $subj_num_file = fopen($file_path, 'w');
    fwrite($subj_num_file, $subj_num);
    fclose($subj_num_file);
?>
