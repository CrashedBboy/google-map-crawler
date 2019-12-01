<?php

    if (isset($_POST['x']) && isset($_POST['y']) && isset($_POST['z']) && isset($_POST['image'])) {


        file_put_contents("tiles/".$_POST['z']."_".$_POST['x']."_".$_POST['y'].".jpg" , base64_decode($_POST['image']));

        echo '{"result": true}';

        return;
    }
    
    echo '{"result": false}';
    return;
?>