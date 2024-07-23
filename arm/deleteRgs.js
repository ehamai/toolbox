import { deleteRg, fetchRgs } from './utils/armClient.js';
import { stringExistsInArray } from './utils/arrays.js';
import { processArgs } from './utils/processInputs.js';
import { input } from '@inquirer/prompts';

const excludedRgs = [
    '/subscriptions/cf3c16db-6165-4a85-ab3a-32a65ab66d6f/resourceGroups/cleanupservice',
    '/subscriptions/cf3c16db-6165-4a85-ab3a-32a65ab66d6f/resourceGroups/cloud-shell-storage-westus',
    '/subscriptions/cf3c16db-6165-4a85-ab3a-32a65ab66d6f/resourceGroups/networkanalyzer'
]

const deleteRgs = async (subscriptionId, write) => {

    if (write) {
        const confirmed = await input({message: `WARNING: You've chosen to perform destructive actions.  Continue? (Y/N)`});
        if (confirmed !== 'Y' && confirmed !== 'y') {
            process.exit();
        }
    } else{
        console.log(`\nRunning in READONLY mode\n`);
    }

    const response = await fetchRgs(subscriptionId);

    if (response.ok) {
        const body = await response.json();
        for (const rg of body.value) {
            if (stringExistsInArray(excludedRgs, rg.id)) {
                console.log(`-- Excluding: ${rg.id}`);
            } else {
                console.log(`${rg.id}`);
                if (write) {
                    const deleteResponse = deleteRg(rg.id);
                    if(deleteResponse.ok){
                        console.log(`Successfully kicked of deletion for: '${rg.id}'`);
                    }
                }
            }
        }
    }
}

let inputs = {
    subscriptionId: null,
    write: false,
}

inputs = processArgs(inputs);
deleteRgs(inputs.subscriptionId, inputs.write);
