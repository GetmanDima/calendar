export const getEmailFromUrl = (): string => {
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams.get('email') ?? '';
};

export const getTokenFromUrl = (): string => {
    const urlParts = window.location.pathname.split('/');

    return urlParts[urlParts.length - 1] ?? '';
};
