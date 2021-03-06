/**
 * Created by Brucelee Thanh on 02/12/2016.
 */
var async = require('async');
var path = require('path');
var config = require(path.join(__dirname, '../', 'config.json'));
var Status = require(path.join(__dirname, '../', 'schemas/status.js'));
var like_status = require(path.join(__dirname, '../', 'cores/like_status.js'));
var comment_status = require(path.join(__dirname, '../', 'cores/comment_status.js'));

exports.getTimeLine = function (data, callback) {
    var query = Status.find({
        owner: data.owner,
        type: 1
    });
    var limit = 10;
    var offset = 0;
    if (data.page !== undefined && data.per_page !== undefined) {
        limit = data.per_page;
        offset = (data.page - 1) * data.per_page;
        query.limit(limit).offset(offset);
    }
    query.select('_id owner content images type created_at');
    query.populate('owner', '_id first_name last_name email intro fb_id phone_number address gender birthday religion avatar cover created_at');
    query.sort({created_at: -1});
    query.exec(function (error, results) {
        if (error) {
            require(path.join(__dirname, '../', 'ultis/logger.js'))().log('error', JSON.stringify(error));
            if (typeof callback === 'function') return callback(-2, null);
        } else if (results.length < 0) {
            if (typeof callback === 'function') return callback(-1, null);
        } else {
            if (typeof callback === 'function') return callback(null, results);
        }
    });
};

exports.getNewsFeed = function (id_user, data, callback) {
    var lstStatus = null;
    async.series({
        getStatus: function (callback) {
            var query = Status.find({
                $and: [
                    {owner: {$in: data._id}},
                    {permission: {$in: data.permission}}
                ],
                type: data.type
            });
            var limit = 10;
            var offset = 0;
            if (data.page !== undefined && data.per_page !== undefined) {
                limit = data.per_page;
                offset = (data.page - 1) * data.per_page;
                query.skip(offset).limit(limit);
            }
            query.select('_id owner content images amount_like amount_comment type permission created_at');
            query.populate('owner', '_id first_name last_name avatar');
            query.sort({created_at: -1});
            query.exec(function (error, results) {
                if (error) {
                    require(path.join(__dirname, '../', 'ultis/logger.js'))().log('error', JSON.stringify(error));
                    if (typeof callback === 'function') return callback(-2, null);
                } else if (results.length <= 0) {
                    if (typeof callback === 'function') return callback(-1, null);
                } else {
                    if (typeof callback === 'function') {
                        lstStatus = JSON.parse(JSON.stringify(results));
                        return callback(null, null);
                    }
                }
            });
        },
        checkInteract: function (callback) {
            var newsFeed = [];
            async.eachSeries(lstStatus, function (item, callback) {
                async.parallel({
                    checkLike: function (callback) {
                        like_status.checkLikeStatusExits(item._id, id_user, function (error, result) {
                            if (error) {
                                item.is_like = 0;
                                return callback(null, null);
                            } else {
                                item.is_like = 1;
                                return callback(null, null);
                            }
                        });
                    },
                    checkComment: function (callback) {
                        comment_status.checkUserAlreadyCommentOnStatus(item._id, id_user, function (error, result) {
                            if (error) {
                                item.is_comment = 0;
                                return callback(null, null);
                            } else {
                                item.is_comment = 1;
                                return callback(null, null);
                            }
                        });
                    }
                }, function (error, result) {
                    newsFeed.push(item);
                    return callback(null);
                });
            }, function (error) {
                return callback(null, newsFeed);
            })
        }
    }, function (error, results) {
        if (error === -1) {
            return callback(-4, null);
        } else if (error) {
            return callback(error, null);
        } else {
            return callback(null, results.checkInteract);
        }

    });

};