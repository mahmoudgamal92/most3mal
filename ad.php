<?php
    $offer_id = $_GET['offer_id'];

if(isset($_GET['action']))
{
    $action = $_GET['action'];

    if($action == 'update')
    {
        $id = $_GET['id'];
        $title = $_GET['title'];
        $details = $_GET['details'];
        $price = $_GET['price'];
        $address = $_GET['address'];
        $coords = $_GET['coords'];

        $cmd = "update ads set title = '$title', details = '$details' , price = '$price' , address =  '$address' , coords = '$coords' where id = '$id'";
        $res = mysqli_query($con,$cmd) or die(mysqli_error($con));
    }
}
?>