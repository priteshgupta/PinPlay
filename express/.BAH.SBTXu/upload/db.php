<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Pritesh
 * Date: 11/16/13
 * Time: 9:55 PM
 * To change this template use File | Settings | File Templates.
 */

// Connect to the database
$link = mysql_connect('localhost', 'root', 'password');

// No error handling; assume everything is alright. ;-)
mysql_select_db('spotdrop', $link);