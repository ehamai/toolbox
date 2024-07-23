import fetch from 'node-fetch';

let token = process.env.token;
if (!token) {
    throw Error('No token set.  Run "source ./getToken.sh"');
}

token = `Bearer ${token}`

const headers = {
    'Authorization': token,
    'Content-Type': 'applicaiton/json'
}

export const fetchRgs = async (subscriptionId) =>{
    const response = await fetch(
        `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups?api-version=2024-03-01`,
        {
            headers: headers
        });

    if(!response.ok){
        const text = await response.text();
        console.error(text)
    }

    return response;
}

export const deleteRg = async (resourceId) =>{
    const response = await fetch(
        `https://management.azure.com${resourceId}?api-version=2024-03-01`,
        {
            headers: headers,
            method: 'DELETE'
        });

    if(!response.ok){
        const text = await response.text();
        console.error(text)
    }

    return response;
}