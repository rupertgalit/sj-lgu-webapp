export function login(data) {
    const { access_token, details } = data;
    document.cookie = JSON.stringify({ access_token, details });
    setTimeout(() => location.replace('/dashboard'), 300);
}
export function signout() {
    document.cookie = '{}';
    setTimeout(() => location.reload('/'), 300);
}
