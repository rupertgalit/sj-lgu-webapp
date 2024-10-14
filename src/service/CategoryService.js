export const CategoryService = {
    endpoint: 'categories',

    async getAllCategory(length = null, page = 1) {
        const res = await fetch(`api/${this.endpoint}-display`, {
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

    async getCategory(id) {
        const res = fetch(`${this.endpoint}`, {
            headers: {
                // 'X-API-KEY': import.meta.env.VITE_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reference_number: 'TEST-CI0028814' }),
            method: 'POST'
        });
    },

    async createCategory(params) {
        const res = await fetch(`api/${this.endpoint}-insert`, {
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
    },
    async updateCategory(params, id) {
        const res = await fetch(`api/${this.endpoint}-update/${id}`, {
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
