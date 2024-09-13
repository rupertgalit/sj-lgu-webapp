export function login(data) {
    localStorage.setItem('user', JSON.stringify(data));
    setTimeout(() => location.replace('/dashboard'), 300);
}
export function signout() {
    localStorage.removeItem('user');
    setTimeout(() => location.reload('/'), 300);
}
