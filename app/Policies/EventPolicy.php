<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function view(User $user, Event $event): bool
    {
        return $this->belongsToUser($user, $event);
    }

    public function update(User $user, Event $event): bool
    {
        return $this->belongsToUser($user, $event);
    }

    public function delete(User $user, Event $event): bool
    {
        return $this->belongsToUser($user, $event);
    }

    private function belongsToUser(User $user, Event $event): bool
    {
        return $user->id === $event->user_id;
    }
}
