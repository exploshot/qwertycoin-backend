/**
 *     Copyright (c) 2019, ExploShot
 *     Copyright (c) 2019, The Qwertycoin Project
 *
 *     All rights reserved.
 *     Redistribution and use in source and binary forms, with or without modification,
 *     are permitted provided that the following conditions are met:
 *
 *     ==> Redistributions of source code must retain the above copyright notice,
 *         this list of conditions and the following disclaimer.
 *     ==> Redistributions in binary form must reproduce the above copyright notice,
 *         this list of conditions and the following disclaimer in the documentation
 *         and/or other materials provided with the distribution.
 *     ==> Neither the name of Qwertycoin nor the names of its contributors
 *         may be used to endorse or promote products derived from this software
 *          without specific prior written permission.
 *
 *     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *     "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *     LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *     A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 *     CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *     EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 *     PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *     PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *     LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *     NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *     SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const config = require('./config');
const rpcLib = require('./../lib/RPC/qwertycoin-rpc');

startTests();

async function testNode() {
    console.log('===================================================================================');
    console.log("Starting Nodes test");
    console.log('***********************************************************************************\n');

    for (i =0; i < config.nodes.length; i++) {
        console.log(config.nodes[i]);
        let split = config.nodes[i].split(':');
        let host = split[0];
        let port = split[1];
        let opts = {};
        opts.host = host;
        opts.port = port;

        await rpcLib(opts).getInfo().then((res) => {
            console.log(`Status: ${res['status']}`);
            console.log(`Sync height: ${res['height']}`);
            console.log('-----------------------------------------------------------------------------------\n');
        }).catch((err) => {
            console.log(err['message']);
        });
    }
}

async function testGetBlocks() {
    console.log('===================================================================================');
    console.log('Starting getBlocks');
    console.log('***********************************************************************************\n');

    for (i =0; i < config.nodes.length; i++) {
        console.log(config.nodes[i]);
        let split = config.nodes[i].split(':');
        let host = split[0];
        let port = split[1];
        let opts = {};
        let gBOpts = {};
        opts.host = host;
        opts.port = port;
        gBOpts.height = 1;

        await rpcLib(opts).getBlocks(gBOpts).then((res) => {
            for (let i = 0; i < res.length; i++) {
                console.log(`Hash from Block ${res[i]['height']}: ${res[i]['hash']}`);
                console.log('-----------------------------------------------------------------------------------\n');
            }
        }).catch((err) => {
            console.log(err['message']);
        });

    }

}

async function testGetBlock() {
    console.log('===================================================================================');
    console.log('Starting getBlock');
    console.log('***********************************************************************************\n');

    for (i =0; i < config.nodes.length; i++) {
        console.log(config.nodes[i]);
        let split = config.nodes[i].split(':');
        let host = split[0];
        let port = split[1];
        let opts = {};
        let gBOpts = {};
        opts.host = host;
        opts.port = port;
        gBOpts.hash = '1bd5eb67b4aabb603cb362a7f8030e05d659fca96081bb7efd5ebabac5fcbc7f'; // 0

        await rpcLib(opts).getBlock(gBOpts).then((res) => {

            console.log(`Height of Block ${gBOpts['hash']}: ${res['height']}`);
            console.log(`Confis of Block ${gBOpts['hash']}: ${res['depth']}`);
            console.log(`Tx Count of Block ${gBOpts['hash']}: ${res['transactions'].length}`);
            console.log('-----------------------------------------------------------------------------------\n');
        }).catch((err) => {
            console.log(err['message']);
        });

    }
}

async function testQueryBlocksDetailed() {
    console.log('===================================================================================');
    console.log('Starting queryBlocksDetailed');
    console.log('***********************************************************************************\n');

    for (i =0; i < config.nodes.length; i++) {
        console.log(config.nodes[i]);
        let split = config.nodes[i].split(':');
        let host = split[0];
        let port = split[1];
        let opts = {};
        let gBOpts = {};
        opts.host = host;
        opts.port = port;
        gBOpts.blockHashes = [
            '1bd5eb67b4aabb603cb362a7f8030e05d659fca96081bb7efd5ebabac5fcbc7f',
            '6f783fc255bd66ed936e2aa03ce4ae908ff4e93cd4b7816d2734b92b7ff8f83d',
            '864644b8e13f0716358b082e6900a0a0f49153a799011ffb0771e9b43b94b66e'
        ]; // 0 - 2

        await rpcLib(opts).queryBlocksDetailed(gBOpts).then((res) => {
            console.log(res);

            console.log('-----------------------------------------------------------------------------------\n');
        }).catch((err) => {
            console.log(err['message']);
        });

    }
}

async function startTests() {
    await testNode();
    await testGetBlocks();
    await testGetBlock();
    await testQueryBlocksDetailed();
}
