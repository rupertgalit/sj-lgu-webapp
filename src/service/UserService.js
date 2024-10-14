export const UserService = {
    endpoint: 'account',

    async getAllUser(length = null, page = 1) {
        const res = await fetch(`api/${this.endpoint}s`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.status == 200) return await res.json();
        return {
            status: res.status,
            type: res.type,
            message: res.statusText
        };
    },
    async getUser(id) {
        const res = fetch(`${import.meta.env.VITE_API_URL}${this.endpoint}`, {
            headers: {
                // 'X-API-KEY': import.meta.env.VITE_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reference_number: 'TEST-CI0028814' }),
            method: 'POST'
        });
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
