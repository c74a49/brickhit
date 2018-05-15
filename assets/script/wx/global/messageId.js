module.exports = {
    MessageID:{
        ON_MSG_GET_FRIEND_RANK_OPEN : 1, // 微信 好友排行
        ON_MSG_GET_FRIEND_RANK_NEXT : 2,
        ON_MSG_GET_FRIEND_RANK_BEFORE : 3,
        ON_MSG_GET_FRIEND_RANK_CLOSE : 4,
        ON_MSG_POST_FRIEND_INFO     : 5, //发送个人信息 以 [{key,value}]形式

        ON_MSG_GET_GROUP_RANK_OPEN :20,  // 微信 群排行
        ON_MSG_GET_GROUP_RANK_NEXT :21,
        ON_MSG_GET_GROUP_RANK_BEFORE :22,
        ON_MSG_GET_GROUP_RANK_CLOSE :23,

        ON_MSG_GET_NEXT_PEOPLE:30,// 下一个需要超越领先的人
        ON_MSG_GET_ADJACENT_PEOPLE:31, //与我 相邻的两人
    }
}