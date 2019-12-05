<?php

    if (isset($_POST['x']) && isset($_POST['y']) && isset($_POST['z']) && isset($_POST['image'])) {

        $filePath = null;

        if (isset($_POST['region']) && !empty($_POST['region']) && $_POST['region'] !== '') {

            $filePath = "region/".$_POST['region']."/".$_POST['z']."/".$_POST['x']."_".$_POST['y'].".jpg";

            if (!file_exists("region/".$_POST['region'])) {

                mkdir("region/".$_POST['region']);
            }

            if (!file_exists("region/".$_POST['region']."/".$_POST['z'])) {

                mkdir("region/".$_POST['region']."/".$_POST['z']);
            }
        
        } else {

            $filePath = "tiles/".$_POST['z']."/".$_POST['x']."_".$_POST['y'].".jpg";

            if (!file_exists("tiles/".$_POST['z'])) {

                mkdir("tiles/".$_POST['z']);
            }
        }

        file_put_contents($filePath, base64_decode($_POST['image']));

        echo '{"result": true}';

        return;
    }
    
    echo '{"result": false}';
    return;

?>