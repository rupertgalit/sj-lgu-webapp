const meta = import.meta.env;

export const TransactionService = {
    endpoint: 'transaction',
    async getAllTransaction(per_page = null, page = 1, sorting = { direction: 'desc', sort: 'Trans_Id' }) {
        const res = await fetch(`/api/transaction-display`, {
            method: 'POST',
            body: JSON.stringify({
                ...sorting,
                per_page,
                page
            })
        });

        if (res.status == 200) return res.json();
        return {
            status: res.status,
            data: [],
            pagination: {},
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

    async searchTx(search) {
        const res = await fetch('/api/transaction-search', {
            headers: {
                // 'X-API-KEY': import.meta.env.VITE_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ search }),
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

    async createTransaction(params) {
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
            data: [],
            type: res.type,
            message: res.statusText
        };
    }
};
