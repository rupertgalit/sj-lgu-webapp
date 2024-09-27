const meta = import.meta.env;

export const TransactionService = {
    endpoint: 'transaction-display',
    async getAllTransaction(length = null, page = 1) {
        const res = await fetch(`/api/${this.endpoint}`, {
            method: 'POST'
        });

        if (res.status == 200) return res.json();
        return {
            status: res.status,
            data: [],
            type: res.type,
            message: res.statusText
        };
    },
    async getTransaction(id) {
        const res = fetch(this.endpoint, {
            headers: {
                // 'X-API-KEY': import.meta.env.VITE_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reference_number: 'TEST-CI0028814' }),
            method: 'POST'
        });
    },

    async createTransaction(params) {
        const res = await fetch(this.endpoint, {
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
            data: [],
            type: res.type,
            message: res.statusText
        };
    }
};
