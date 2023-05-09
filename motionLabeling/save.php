<?php
    header('Content-Type: text/plain');
    $path = $_POST['directory_path'];
    if (!is_dir($path)) {
        mkdir($path, 0777, true);
    }
    $data_file = fopen($_POST['directory_path'] . '/' . $_POST['file_name'], 'a');
    fwrite($data_file, $_POST['data']);
    fclose($data_file);
?>
