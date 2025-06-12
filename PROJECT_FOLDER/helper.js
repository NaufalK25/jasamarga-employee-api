const getEndpoint = (endpoint = '/api') => {
    if (!endpoint) return '';
    endpoint = endpoint.replace(/\/api/, '');
    return (endpoint === '/') ? endpoint : endpoint.replace(/\/$/, '');
}

const calculateAge = (birthDate) => {
    birthDate = new Date(birthDate);
    currDate = new Date();

    let years = (currDate.getFullYear() - birthDate.getFullYear());

    if (currDate.getMonth() < birthDate.getMonth() ||
        currDate.getMonth() == birthDate.getMonth() && currDate.getDate() < birthDate.getDate()) {
        years--;
    }

    return years || 0;
}

module.exports = {
    getEndpoint,
    calculateAge,
}