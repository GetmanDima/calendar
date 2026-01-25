import { computed, ref } from 'vue';

export const useTimer = () => {
    const currentSeconds = ref(0);
    const timer = ref<number | null>(null);

    const isTimerActive = computed(() => currentSeconds.value > 0);

    const startTimer = (seconds: number) => {
        currentSeconds.value = seconds;

        timer.value = window.setInterval(() => {
            currentSeconds.value--;

            if (currentSeconds.value <= 0) {
                if (timer.value !== null) {
                    clearInterval(timer.value);
                }
            }
        }, 1000);
    };

    const clearTimer = () => {
        currentSeconds.value = 0;

        if (timer.value !== null) {
            clearInterval(timer.value);
        }
    };

    return {
        currentSeconds,
        isTimerActive,
        startTimer,
        clearTimer,
    };
};
