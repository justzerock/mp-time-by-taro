// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
// 调用数据库
const db = cloud.database({
  throwOnNotFound: false
});
// 表
const userData = db.collection("user-data-test");

// 云函数入口函数
exports.main = async (event, context) => {
  const { fn, param } = event;
  const openid = cloud.getWXContext().OPENID;
  const dao = {
    setInitData: async ({ list, updateTime }) => {
      try {
        const { total } = await userData.where({
          _openid: openid
        })
          .count()
        if (total) {
          return await userData.where({
            _openid: openid
          })
            .update({
              data: {
                isDark: false,
                updateTime: updateTime,
                list: list
              }
            })
        } else {
          return await userData.add({
            data: {
              isDark: false,
              updateTime: updateTime,
              list: list,
              _openid: openid
            }
          })
        }
      } catch (e) {
        console.error(e)
      }
    },
    setDarkMode: async ({ isDark }) => {
      try {
        return await userData.where({
          _openid: openid
        })
          .update({
            data: {
              isDark: isDark
            }
          })
      } catch (e) {
        console.error(e)
      }
    },
    setListData: async ({list, updateTime}) => {
      try {
        return await userData.where({
          _openid: openid
        })
          .update({
            data: {
              list: list,
              updateTime: updateTime
            }
          })
      } catch (e) {
        console.error(e)
      }
    },
    getUserData: async () => {
      try {
        return await userData.where({
          _openid: openid
        })
          .get()
      } catch (e) {
        console.error(e)
      }
    },
    login: async () => {
      try {
        return { openid }
      } catch (e) {
        console.error(e)
      }
    }
  }
  return dao[fn](param);
};