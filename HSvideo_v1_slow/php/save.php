<?php
    header('Content-Type: text/plain');
    $path = $_POST['directory_path'];
    if (!is_dir($path)) {
        mkdir($path, 0777, true);
    }
    $dataFile = fopen($_POST['directory_path'] . '/' . $_POST['file_name'], 'a');
    fwrite($dataFile, $_POST['data']);
    fclose($dataFile);
?>