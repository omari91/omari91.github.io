<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST["name"];
    $email = $_POST["email"];
    $comment = $_POST["comment"];

    // Your email address to receive the message
    $to = "engomari6@gmail.com";

    // Subject of the email
    $subject = "New Message from Contact Form";

    // Compose the message
    $message = "Name: $name\n";
    $message .= "Email: $email\n";
    $message .= "Message:\n$comment";

    // Send email
    mail($to, $subject, $message);

    // Display thank you message
    echo "Thank you for your message! We will get back to you soon.";
} else {
    // Redirect to the form page if accessed directly
    header("Location: your_contact_form_page.html");
    exit();
}
?>
