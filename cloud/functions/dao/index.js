// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
// 调用数据库
const db = cloud.database({
  throwOnNotFound: false
});
// 表
const userData = db.collection("user-data");

// 云函数入口函数
exports.main = async (event, context) => {
  const { fn, param } = event;
  const openid = cloud.getWXContext().OPENID;
  const dao = {
    /**
     * 初始化数据
     * 若存在数据则更新，不存在则添加
     */ 
    setInitData: async ({ list }) => {
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
                primary: '#7789A1', 
                birthday: '', 
                explife: 0, 
                weekStartDay: 0,  
                isDetail: true, 
                list: list
              }
            })
        } else {
          return await userData.add({
            data: {
              isDark: false,
              primary: '#7789A1', 
              birthday: '', 
              explife: 0, 
              weekStartDay: 0,  
              isDetail: true, 
              list: list,
              _openid: openid
            }
          })
        }
      } catch (e) {
        console.error(e)
      }
    },

    // 设置暗色模式
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

    // 设置主题色
    setPrimaryColor: async ({ primary }) => {
      try {
        return await userData.where({
          _openid: openid
        })
          .update({
            data: {
              primary: primary
            }
          })
      } catch (e) {
        console.error(e)
      }
    },

    // 设置期望寿命
    setExpLife: async ({ explife }) => {
      try {
        return await userData.where({
          _openid: openid
        })
          .update({
            data: {
              explife: explife
            }
          })
      } catch (e) {
        console.error(e)
      }
    },

    // 设置生日
    setBirthDay: async({ birthday }) => {
      try {
        return await userData.where({
          _openid: openid
        })
          .update({
            data: {
              birthday: birthday
            }
          })
      } catch (e) {
        console.error(e)
      }
    },

    // 设置周首日
    setWeekStartDay: async({ weekStartDay }) => {
      try {
        return await userData.where({
          _openid: openid
        })
          .update({
            data: {
              weekStartDay: weekStartDay
            }
          })
      } catch (e) {
        console.error(e)
      }
    },

    // 设置默认视图
    setViewMode: async({ isDetail }) => {
      try {
        return await userData.where({
          _openid: openid
        })
          .update({
            data: {
              isDetail: isDetail
            }
          })
      } catch (e) {
        console.error(e)
      }
    },

    // 更新数据
    setListData: async ({list}) => {
      try {
        return await userData.where({
          _openid: openid
        })
          .update({
            data: {
              list: list
            }
          })
      } catch (e) {
        console.error(e)
      }
    },

    // 获取数据
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

    // 返回 openid
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