export function formatCurrency(value, currency = null) {
    let params = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    if (currency) {
        params = { ...params, style: 'currency', currency };
    }
    return value.toLocaleString('en-US', params);
}

export function formatDate(value) {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
