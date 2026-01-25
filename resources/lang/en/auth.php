<?php

declare(strict_types=1);

return [
    'verify_email' => [
        'mail' => [
            'subject' => 'Verify Email Address',
            'text' => 'Click the button below to verify your email address.',
            'action' => 'Verify Email Address',
        ],
    ],
    'reset_password' => [
        'mail' => [
            'subject' => 'Reset Password Notification',
            'text' => 'You are receiving this email because we received a password reset request for your account.',
            'action' => 'Reset Password',
        ],
    ],
    'validation' => [
        'unique_email' => 'The email has already been taken.',
    ],
];
