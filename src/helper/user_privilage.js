const routes = [
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-microsoft', to: '/dashboard' }]
    },
    {
        label: 'Tables',
        items: [
            { label: 'Transactions', icon: 'pi pi-fw pi-wallet', to: '/transactions' },
            { label: 'Category', icon: 'pi pi-fw pi-folder', to: '/category' },
            { label: 'Accounts', icon: 'pi pi-fw pi-users', to: '/accounts' }
        ]
    },
    {
        label: 'Forms',
        items: [{ label: 'Create Transaction', icon: 'pi p-fw pi-file-import', to: '/create-transaction' }]
    }
];

const user_privilage = {
    0: 'All',
    1: { Home: ['Dashboard'], Tables: ['Transactions', 'Category'], Forms: ['Create Transaction'] },
    2: { Home: ['Dashboard'], Tables: ['Transactions', 'Category'] },
    3: { Home: ['Dashboard'], Tables: ['Transactions', 'Category', 'Accounts'] },
    4: { Home: ['Dashboard'], Tables: ['Transactions'] }
};

function setPrivilage(usertype) {
    if (usertype == 0) return routes;
    try {
        let privilage_routes = [];
        const _routes = user_privilage[usertype];

        Object.keys(_routes).forEach((route) => {
            let _route = { label: '', items: [] };
            _route.label = route;
            routes.find((__route) => __route.label == route)?.items.forEach((item) => (_routes[route].includes(item.label) ? _route.items.push(item) : false));
            privilage_routes.push(_route);
        });
        return privilage_routes;
    } catch (error) {}
}

export default setPrivilage;
