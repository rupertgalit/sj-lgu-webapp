export default async function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            await func.apply(this, args);
        }, timeout);
    };
}
