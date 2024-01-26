<?php
    function httpGET($url){
        // Create a new cURL resource
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        // Fetch the URL and save the content in $html variable
        $result = curl_exec($curl);
        // close cURL resource to free up system resources
        curl_close($curl);
        return json_decode($result, true);
    }

    header('Content-Type: application/json');
    $response = array();
    //if(!isset($_POST['function'])) { $response['error'] = 'No function name!'; }

    //if(!isset($_POST['parameters'])) { $response['error'] = 'No function arguments!'; }

    if(!isset($response['error'])) {

        switch($_POST['function']) {
            case 'get':
                $response["response"] = httpGET($_POST['parameters']);
                break;

            default:
               $response['error'] = 'Not found function '.$_POST['functionname'].'!';
               break;
        }

    }

    echo json_encode($response);
?>
