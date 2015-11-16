(function(root, factory) {
    /*global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.WebDatabase = factory();
    }
}(window, function() {
    'use strict';
    /*
     ** 介绍Web Sql Database使用
     */
    //web sql database 数据库入口
    function WebDatabase() {};
    (function() {
        /**
         *@decription 如果数据库不存在，则创建 
         *@param {String} 数据库名称
         *@param {String} 版本号
         *@param {String} 数据库描述
         *@param {Number} 数据库大小
         *@param {Function} 回调函数
         */
        var currentDb;

        return WebDatabase.prototype = {
                getCurrentDb: getCurrentDb,
                openDb: openDb,
                createTable: createTable,
                insert: insert,
                query: query,
                update: update,
                deleteItem: deleteItem,
                dropTable: dropTable,
                manualTransaction: manualTransaction
            }
            /**
             * @param  {Object}
             * name {String} 数据库名称
             * version {String} 数据库版本号
             * desc {String} 数据库的描述
             * capacity {Number} 数据库容量
             * callback {Function} 创建或者打开数据库成功的回调
             * @return {Object} 创建或者打开的数据库对象
             */
        function openDb(options) {
            var defaultOptions = {
                    name: '',
                    version: '1.0',
                    desc: '',
                    capacity: 1024 * 1024,
                    callback: function() {}
                },
                optionsValue;
            options = merge(options, defaultOptions);
            optionsValue = getValues(options);
            currentDb = openDatabase.apply(null, optionsValue);
            return currentDb;
        }
        /**
         *@param {String} 创建的sql语句
         *@param {Array} 插入到查询中问号所在处的字符串数据
         *@param {Function} 成功的回调函数
         *@param {Function} 失败的回调函数
         */
        // function executeSql(sql, [], success, fail){
        //数据表操作
        // }

        function matchSql(sql, tableName) {
            var reg = /\{\{(\w+)\}\}$/;
            sql = sql.replace(reg, function(match, set) {
                return tableName;
            });
            return sql;
        }
        /**
         * @description 创建数据表
         * @param {String} tableName 要创建的数据表名称
         * @param {Object} options 描述字段
         * @param {Function} success 成功的回调
         * @param {Function} fail 执行失败的回调
         * @return {Undefined} 不返回结果
         * @example
         * createTable('student',{id:'INTEGER UNIQUE PRIMARY KEY',name:'TEXT'})
         * -----------------------
         * id        | name 
         * -----------------------
         */
        function createTable(tableName, options, success, fail) {
            var sql = 'create table if not exists ' + tableName + ' (' + mergeArrToStr(options, ' ') + ')',
                success = success || function() {
                    alert('success to create a table ' + tableName);
                },
                fail = fail || function() {
                    alert('fail to create a table ' + tableName)
                };
            sql = matchSql(sql, tableName);
            console.log(sql);
            currentDb.transaction(function(tx) {
                tx.executeSql(sql, [], success, fail);
            });
        }
        /**
         * @param {String} tableName 要创建的数据表名称
         * @param  {Object} data 插入的数据字段
         * @param {Function} success 成功的回调
         * @param {Function} fail 执行失败的回调
         * @return {Undefined} 无返回结果
         * @example
         * insert('student',{id:1,name:'author'})
         * -----------------------
         * id        | name 
         * 1		 | author
         * ----------------------- 
         */
        function insert(tableName, data, success, fail) {
            var keys = getKeys(data).join(),
                values = getValues(data),
                qMark = values.map(function() {
                    return '?';
                }),
                sql = 'insert into ' + tableName + ' (' + keys + ") values(" + qMark.join() + ")",
                success = success || function() {
                    alert('success to insert a item to ' + tableName)
                },
                fail = fail || function() {
                    alert('fail to insert a item to ' + tableName)
                };
            sql = matchSql(sql, tableName);
            console.log(sql);
            currentDb.transaction(function(tx) {
                tx.executeSql(sql, values, success, fail);
            });
        }
        /**
         * @param {String} tableName 要创建的数据表名称
         * @param  {Array} options 要查询的字段
         * @param {Function} success 成功的回调
         * @param {Function} fail 执行失败的回调
         * @return {Undefined} 无返回结果
         * @example
         * query('student','id')
         * -----------
         * id        
         * 1		 
         * -----------
         */
        function query(tableName, options, success, fail) {
            Array.isArray(options) ? '' : options = [options];
            var keys = options ? options.join() : '*',
                sql = 'select ' + keys + 'from ' + tableName,
                success = success || function(tx, resultSet) {
                    alert('success to query in ' + tableName);
                    var resultLen = resultSet.rows.length,
                        i = 0,
                        result = [];
                    for (; i < resultLen; i++) {
                        result.push(resultSet.rows.item(i));
                    }
                    console.log(result);
                },
                fail = fail || function() {
                    alert('fail to query in ' + tableName);
                };
            sql = matchSql(sql, tableName);
            console.log(sql);
            currentDb.transaction(function(tx) {
                tx.executeSql(sql, [], success, fail);
            });
        }
        /**
         * @param {String} tableName 要创建的数据表名称
         * @param  {Object} options 要更新的字段以及对应的值
         * @param  {Object} 要更新的查找字段[单条数据]
         * @param {Function} success 成功的回调
         * @param {Function} fail 执行失败的回调
         * @return {Undefined} 无返回结果
         * @example
         * update('student',{name:'AUTHOR'},{name:'id',value:1})
         * -----------------------
         * id        | name 
         * 1		 | AUTHOR
         * -----------------------  
         */
        function update(tableName, options, where, success, fail) {
            var updateStr, fail, success, sql, keys, values, qMark;
            fail = fail || function() {
                    alert('fail to update the ' + tableName);
                },
                success = success || function() {
                    alert('success to update the ' + tableName);
                    console.log(arguments);
                },
                keys = getKeys(options);
            values = getValues(options);
            qMark = keys.map(function() {
                return '?';
            });
            options = {};
            keys.forEach(function(key, index) {
                options[key] = qMark[index];
            });
            values.push(where.value);
            updateStr = mergeArrToStr(options, '='),
                sql = 'update ' + tableName + ' set ' + updateStr + ' where ' + where.name + '= ? ';
            sql = matchSql(sql, tableName);
            console.log(sql);
            currentDb.transaction(function(tx) {
                tx.executeSql(sql, values, success, fail);
            });
        }
        /**
         * @param {String} tableName 要创建的数据表名称
         * @param  {Object} 要删除的查找字段[单条数据]
         * @param {Function} success 成功的回调
         * @param {Function} fail 执行失败的回调
         * @return {Undefined} 无返回结果
         * @example
         * deleteItem('student',{name:'id',value:1})
         * -----------------------
         * id        | name 
         * ----------------------- 
         */
        function deleteItem(tableName, where, success, fail) {
            var sql = 'delete from ' + tableName + ' where ' + where.name + '= ?',
                success = success || function(tx, resultSet) {
                    alert('success to delete a item in ' + tableName);
                    var len = resultSet.rows.length,
                        i = 0,
                        result = [];
                    for (; i < len; i++) {
                        result.push(resultSet.rows.item(i));
                    }
                    console.log(resultSet.rowsAffected);
                },
                fail = fail || function() {
                    alert('fail to delete a item in ' + tableName)
                };
            sql = matchSql(sql, tableName);
            console.log(sql);
            currentDb.transaction(function(tx) {
                tx.executeSql(sql, [where.value], success, fail);
            });
        }
        /**
         * @param  {String} tableName 要删除的数据表名称
         * @param  {Function} 删除成功的回调
         * @param  {Function} 删除失败后的回调
         * @return {Undefined} 无返回结果
         * @example
         * dropTable('student')
         * -------------------
         * -------------------
         */
        function dropTable(tableName, success, fail) {
            var sql = 'drop table ' + tableName,
                success = success || function() {
                    console.log('dropTable:', arguments);
                },
                fail = fail || function() {};
            sql = matchSql(sql, tableName);
            console.log(sql);
            currentDb.transaction(function(tx) {
                tx.executeSql(sql, [], success, fail);
            });
        }
        /**
         * @description 自己手动执行的sql
         * @param  {String} sql语句
         * @param  {Array||String} 需要的数据
         * @param  {Function} 成功执行后的回调
         * @param  {Function} 执行失败的回调
         * @return {Undefined} 无返回结果
         * @example
         * var sql = 'create table if not exists student (id INTEGER NOT NULL PRIMARY KEY,name TEXT)';
         * manualTransaction(sql);
         * -----------------------
         * id 		   | name
         * -----------------------
         */
        function manualTransaction(sql, values, success, fail) {
            values = Array.isArray(values) ? values : [values];
            currentDb.transaction(function(tx) {
                tx.executeSql(sql, values, success, fail);
            });
        }
        /**
         * @return {Object} 当前的活动数据库
         */
        function getCurrentDb() {
            return currentDb;
        }


        function merge(target, source) {
            var result = {};
            for (var i in source) {
                if (source.hasOwnProperty(i)) {
                    result[i] = target[i] || source[i];
                }
            }
            return result;
        }

        function getValues(obj) {
            var keys = getKeys(obj),
                length = keys.length,
                values = [];
            for (var i = 0; i < length; i++) {
                values[i] = obj[keys[i]];
            }
            return values;
        }

        function getKeys(obj) {
            if (typeof obj !== 'object') return [];
            return Object.keys(obj);
        }

        function mergeArrToStr(options, connector) {
            var keys = getKeys(options),
                values = getValues(options),
                updateStr;
            updateStr = keys.map(function(value, index) {
                return value + connector + values[index];
            });
            return updateStr.join();
        }
    })();

}));
