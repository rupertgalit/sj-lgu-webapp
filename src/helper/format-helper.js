export function formatCurrency(value, currency = null) {
    let params = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    if (currency) {
        params = { ...params, style: 'currency', currency };
    }
    return (typeof value == 'string' ? parseInt(value) : value).toLocaleString('en-US', params);
}

export function formatDate(value, with_time = false) {
    let dateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    if (value == null || value == undefined) return '-';
    if (with_time) dateOptions = { ...dateOptions, hour: '2-digit', minute: '2-digit', hour12: true };

    value = typeof value == 'string' ? new Date(value) : value;
    return value.toLocaleDateString('en-US', dateOptions).replaceAll(',', '');
}

export function capitalize(str) {
    return str.at(0).toUpperCase() + str.substring(1);
}
