/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const patients = [
            {
                name: 'kalithas',
                disease: 'fever',
                id:01,
            },
            {
                name: 'naveenkumar',
                disease: 'corona',
		id:02,
                
            },
	    {
                name: 'jothi',
                disease: 'dengue',
		id:03,
                
            },
	    {
                name: 'afrin',
                disease: 'nepha',
		id:04,
                
            },
            
        ];

        for (let i = 0; i < patients.length; i++) {
            patients[i].docType = 'patient';
            await ctx.stub.putState('PATIENT' + i, Buffer.from(JSON.stringify(patients[i])));
            console.info('Added <--> ', patients[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryPatient(ctx, id) {
        const patientAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!patientAsBytes || patientAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(patientAsBytes.toString());
        return patientAsBytes.toString();
    }

    async createPatient(ctx, name,disease,id) {
        console.info('============= START : Create Car ===========');

        const patient = {
            name,
            docType: 'patient',
            disease
            id,
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(patient)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllPatient(ctx) {
        const startKey = '01';
        const endKey = '99';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

   

}

module.exports = FabCar;carNumb
