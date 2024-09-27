export const AuthService = {
    endpoint: 'login',

    async Authenticate(params) {
        const res = await fetch(`/api/${this.endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        if (res.status == 200) return await res.json();

        return {
            status: res.status,
            type: res.type,
            message: res.statusText
        };
    }
};
