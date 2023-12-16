<?php
    header('Content-Type: application/json');
    
    $localFile = isset($_GET['local']) ? $_GET['local'] : '';
    $ignore_paths = file_get_contents(".ignore");
    $ignore_paths = explode("\n", $ignore_paths);
    $ignore_paths = array_filter($ignore_paths); // Remove any empty lines

    $paths = array_slice(scandir("sheets"), 2); // Skip '.' and '..' entries
    $paths = array_diff($paths, $ignore_paths); // Remove ignored paths

    if ($localFile !== '' && file_exists("sheets/" . $localFile)) {
        $paths = [$localFile]; // Only return the local file if it exists
    } else {
        $paths = array_values($paths); // Re-index array after removing ignored paths
    }

    echo json_encode(["paths" => $paths]);
?>