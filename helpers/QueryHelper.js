const { connectionPool } = require('../mysql/connection');

class QueryHelper {
    constructor(sql, data=[], preprocess=null) {
        this.sql = sql;
        this.data = data;
        this.preprocess = preprocess;
    }

    then(callback) {
        this.preprocess = callback;

        return this;
    }

    withParams() {
        this.data = Array.from(arguments);

        return this;
    }

    commit() {
        return new Promise((resolve, reject) => {
            connectionPool.query(this.sql, this.data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (this.preprocess) {
                        resolve(this.preprocess(result));
                    }
                    
                    resolve(result);
                }
            });
        });
    }

    static query(sql) {
        return new QueryHelper(sql);
    }
};

module.exports = QueryHelper