import { deleteRg, fetchRgs } from './utils/armClient.js';
import { stringExistsInArray } from './utils/arrays.js';
import { getExcludedResourceIds, processArgs } from './utils/processInputs.js';
import { input } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const curDirPath = dirname(__filename);

const deleteRgs = async (subscriptionId, write, excludedRgs) => {

    if (write) {
        const confirmed = await input({message: `WARNING: You've chosen to perform destructive actions.  Continue? (Y/N)`});
        if (confirmed !== 'Y' && confirmed !== 'y') {
            process.exit();
        }
    } else{
        console.log(`\nRunning in READONLY mode\n`);
    }

    console.log('These are the resourceIds that will be deleted:');
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
const excludedIds = await getExcludedResourceIds(`${curDirPath}/.donotdelete`);
deleteRgs(inputs.subscriptionId, inputs.write, excludedIds);
