export default async function GetIP() {
    return await fetch('https://api.ipify.org?format=text').then((res) => res.text());
}
