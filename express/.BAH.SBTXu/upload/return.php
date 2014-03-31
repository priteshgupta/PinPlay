<?php

// Include the database config
include_once "db.php";

// Master array to return
$return = array();

// Type of request
$type = $_GET['type'];

switch ($type) {
    case 'file':    // If a file upload
        // The query; no PDO for this app :-(
        $sql    = "select * from sdrop";
        $result = mysql_query($sql, $link);

        // Loop through them
        while ($row = mysql_fetch_assoc($result)) {

            $data = array(
                'id'   => $row['id'],
                'file' => $row['fname'],
                'lat'  => $row['lat'],
                'long' => $row['lng']
            );

            // Push to master array
            array_push($return, $data);
        }
        break;

    case 'text':    // Else if a status upload
        // The query; no PDO for this app :-(
        $sql    = "select * from sdrop_text";
        $result = mysql_query($sql, $link);

        // Loop through them
        while ($row = mysql_fetch_assoc($result)) {

            $data = array(
                'id'   => $row['id'],
                'text' => $row['sname'],
                'lat'  => $row['lat'],
                'long' => $row['lng']
            );

            // Push to master array
            array_push($return, $data);
        }
        break;
}

// echo json encoded array
echo json_encode($return);

// Free the memory
mysql_free_result($result);

// Close the connection
mysql_close($link);