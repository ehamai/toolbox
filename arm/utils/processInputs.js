import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const assignToInputParam = (inputObject, paramName, paramValue) =>{
    if(Object.keys(inputObject).indexOf(paramName) < 0){
        throw Error(`Input parameter '${paramName}' is invalid.  Here's the input properties: ${JSON.stringify(inputObject)}`);
    }

    inputObject[paramName] = paramValue;
}

// inputs is an object which has properties defined for available inputs
export const processArgs = (inputs) =>{
    if(process.argv.length === 2){
        throw Error('Missing arguments')
    }

    for(let i = 2; i < process.argv.length; i++){
        const arg = process.argv[i];
        if(!arg.startsWith('-') && !arg.startsWith('--')){
            throw Error(`Input params should start with either '-' or '--'`);
        }

        // Handle boolean input params
        if(arg.startsWith('--')){
            const name = arg.substring(2);
            assignToInputParam(inputs, name, true);
        } else {
            // Handle inputs which start with just '-'.  This expects the next parameter to be the value.

            const name = arg.substring(1);
            if(i + 1 === process.argv.length){
                throw Error(`Missing value for parameter '${name}'`);
            }

            assignToInputParam(inputs, name, process.argv[i + 1]);
            i++;
        }
    }

    console.log(`Parsed inputs: \n${JSON.stringify(inputs, null, '  ')}`);

    return inputs;
}

export const getExcludedResourceIds = async (filePath) =>{
    const resourceIds = [];
    try{
        const fileStream = createReadStream(filePath);

        const rl = createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
    
        for await (const line of rl) {
            resourceIds.push(line);
        }    
    }catch(e){
        console.log(`\n---- WARNING!!!: No excluded file was found under '${filePath}'.  If you wish to exclude some resourceIds, add them to this file ----`);
    }

    return resourceIds;
}