export const AuthService = {
    endpoint: 'auth',

    async Authenticate(params) {
        const res = fetch(`${import.meta.env.VITE_API_URL}${this.endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        if (res.status == 200) return res.json();
        return {
            status: res.status,
            type: res.type,
            message: res.statusText
        };
    }
};
