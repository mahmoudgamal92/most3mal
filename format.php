<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include_once './../config/dbconnect.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $useremail = $_POST['useremail'];
    $password = $_POST['password'];

    $cmd = "select * from users where email = '$useremail'";
    $query = mysqli_query($con, $cmd);


    if (mysqli_num_rows($query) == 0) {


        echo json_encode(array(
            "success" => false,
            "message" => "هناك خطأ في بيانات الدخول",
        ));
    } else {

        // Email Is Correct => Check Password
        if (password_verify($password, $hashedPassword)) {
            echo json_encode(array(
                "success" => true,
                "message" => "أهلا بك , تم تسجيل الدخول بنجاخ"
            ));
        } else {
            echo json_encode(array(
                "success" => false,
                "message" => "كلمة المرور غير صحيحة",
            ));
        }

    }
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "نأسف هناك مشكلة في تسجيل الدخول , من فضلك حاول لاحقا",
    ));
}
$con->close();
?>