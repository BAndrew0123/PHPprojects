<?php
include('database.php');
session_start();
$error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $pass = $_POST['password'];

    $query = "SELECT * FROM users WHERE username = '$username' AND email = '$email'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) === 1) {
        $user = mysqli_fetch_assoc($result);

        if (password_verify($pass, $user['password'])) {
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];

            header("Location: ecommerce.html");
            exit();
        } else {
            $error = "Incorrect password.";
        }
    } else {
        $error = "User not found.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="index.css">
    <style>
        .error {
            color: red;
            margin-bottom: 10px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="Log_container">
        <h2>Login</h2>

        <!-- Show error if exists -->
        <?php if (!empty($error)) : ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>

        <form action="login.php" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>

        <p>Don't have an account? <a href="register.php">Register here</a></p>
    </div>
</body>
</html>
