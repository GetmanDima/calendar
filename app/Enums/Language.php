<?php

declare(strict_types=1);

namespace App\Enums;

enum Language: string
{
    case EN = 'en';
    case RU = 'ru';

    /**
     * @return string[]
     */
    public static function values(): array
    {
        return array_map(
            fn ($language) => $language->value,
            self::cases()
        );
    }
}
