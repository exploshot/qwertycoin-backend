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

'use strict';

const req = require('request-promise-native');
const util = require('util');

const QwertycoinRPC = function (opts) {
    opts = opts || {};
    if (!(this instanceof QwertycoinRPC)) {
        return new QwertycoinRPC(opts);
    }
    this.host = opts.host || '127.0.0.1';
    this.port = opts.port || '8196';
    this.timeout = opts.timeout || 2000;
    this.ssl = opts.ssl || false;
};

QwertycoinRPC.prototype.getBlocks = function (opts) {
    return new Promise((resolve, reject) => {
        opts = opts || {}
        if (typeof opts.height === 'undefined') return reject(new Error('must specify height'))

        this._post('f_blocks_list_json', {
            height: opts.height
        }).then((result) => {
            return resolve(result.blocks)
        }).catch((err) => {
            return reject(err)
        })
    })
};

QwertycoinRPC.prototype.getBlock = function (opts) {
    return new Promise((resolve, reject) => {
        opts = opts || {}
        if (!opts.hash) return reject(new Error('must specify hash'))

        this._post('f_block_json', {
            hash: opts.hash
        }).then((result) => {
            return resolve(result.block)
        }).catch((err) => {
            return reject(err)
        })
    })
};

QwertycoinRPC.prototype.getInfo = function (opts) {
    return this.info();
};

QwertycoinRPC.prototype.queryBlocksDetailed = function (opts) {
    /*
        first 10 blocks id goes sequential, next goes in pow(2,n) offset, 
        like 2, 4, 8, 16, 32, 64 and so on, and the last one is always genesis block 
    */
    return new Promise((resolve, reject) => {
        opts = opts || {}
        if (!Array.isArray(opts.blockHashes)) return reject(new Error('must supply an array of block hashes'))
        if (opts.timestamp === undefined) opts.timestamp = 0
        if (opts.blockCount === undefined) opts.blockCount = 100

        var body = {
            blockIds: opts.blockHashes,
            timestamp: opts.timestamp,
            blockCount: opts.blockCount
        };

        this._rawPost('queryblocksdetailed', body).then((result) => {
            return resolve(result)
        }).catch((err) => {
            return reject(err)
        });
    });
};

QwertycoinRPC.prototype.info = function () {
  return new Promise((resolve, rej) => {
      this._get('getinfo').then((res) => {
        return resolve(res);
      }).catch((err) => {
        return rej(err);
      });
  });
};

QwertycoinRPC.prototype.sendRawTrancaction = function(opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.tx) return reject(new Error('must specify raw serialized transaction'))

    this._rawPost('sendrawtransaction', {
      tx_as_hex: opts.tx
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    });
  });
};

QwertycoinRPC.prototype._get = function (method) {
    return new Promise((res, rej) => {
        if (method.length === 0) {
            return rej(new Error('no method supplied'));
        }

        let protocol = (this.ssl) ? 'https' : 'http';

        req(
            {
                uri: util.format(`${protocol}://${this.host}:${this.port}/${method}`),
                method: 'GET',
                json: true,
                timeout: this.timeout
            }
        ).then((result) => {
            return res(result);
        }).catch((err) => {
            return rej(err);
        });
    });
};

QwertycoinRPC.prototype._post = function (method, params) {
    return new Promise((resolve, reject) => {
        if (method.length === 0) return reject(new Error('no method supplied'))
        params = params || {}

        var body = {
            jsonrpc: '2.0',
            method: method,
            params: params
        }

        this._rawPost('json_rpc', body).then((result) => {
            if (!result.error) {
                return resolve(result.result)
            } else {
                return reject(result.error.message)
            }
        }).catch((err) => {
            return reject(err)
        })
    })
};

QwertycoinRPC.prototype._rawPost = function (endpoint, body) {
    return new Promise((res, rej) => {
        if (endpoint.length === 0) {
            return rej(new Error('no endpoint supplied'));
        }
        if (body === undefined) {
            return rej(new Error('no body supplied'));
        }

        let protocol = (this.ssl) ? 'https' : 'http';

        req(
            {
                uri: util.format(`${protocol}://${this.host}:${this.port}/${endpoint}`),
                method: 'POST',
                body: body,
                json: true,
                timeout: this.timeout
            }
        ).then((result) => {
            return res(result);
        }).catch((err) => {
            return rej(err);
        });
    });
};

module.exports = QwertycoinRPC;
