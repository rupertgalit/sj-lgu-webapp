export const UserService = {
    endpoint: 'users',

    async getAllUser(length = null, page = 1) {
        const res = fetch(`${import.meta.env.VITE_API_URL}${this.endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.status == 200) return res.json();
        return {
            status: res.status,
            type: res.type,
            message: res.statusText
        };
    },
    async getUser(id) {
        console.log(id, import.meta.env);
        const res = fetch(`${import.meta.env.VITE_API_URL}${this.endpoint}`, {
            headers: {
                // 'X-API-KEY': import.meta.env.VITE_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reference_number: 'TEST-CI0028814' }),
            method: 'POST'
        });
        console.log(res.status);
    },

    async createUser(params) {
        const res = fetch(`${import.meta.env.VITE_API_URL}${this.endpoint}`, {
            headers: {
                // 'X-API-KEY': import.meta.env.VITE_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
            method: 'POST'
        });
        if (res.status == 200) return await res.json();
        return {
            status: res.status,
            type: res.type,
            message: res.statusText
        };
    }
};
