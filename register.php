<?php
include('database.php');
session_start();
$error = '';

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $pass = $_POST['password'];

    $hashed_pass = password_hash($pass, PASSWORD_DEFAULT);

    // Check if user already exists
    $check_query = "SELECT * FROM users WHERE username = '$username' OR email = '$email'";
    $check_result = mysqli_query($conn, $check_query);

    if (mysqli_num_rows($check_result) > 0) {
        $error = "Username or email already taken.";
    } else {
        // Insert new user
        $insert_query = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashed_pass')";
        if (mysqli_query($conn, $insert_query)) {
            header("Location: login.php");
            exit(); // Add exit after header redirect
        } else {
            $error = "Registration failed: " . mysqli_error($conn);
        }
    }

    mysqli_close($conn);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
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
    <div class="register-container">
        <h2>Register</h2>

        <!-- Show error if any -->
        <?php if (!empty($error)) : ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>

        <form action="register.php" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>

        <p>Already have an account? <a href="login.php">Login here</a></p>
    </div>
</body>
</html>
