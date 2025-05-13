# etherreq

一个轻量级、无感知的 HTTP 请求库，基于  Fetch封装，支持自动 Token 注入、拦截器、TypeScript 类型定义等功能。

##  快速使用

安装

```
npm install etherreq
# 或者
yarn add etherreq
```

## API 接口

```javascript
import { etherreq } from 'etherreq';

// GET 请求
import { etherreq } from 'etherreq';
  const  ab = async () => {
    const a= await etherreq.get('http://localhost:8081/api/users')
    //获取gat数据
    console.log(a);
  }

// POST 请求
etherreq.post('/login', { username: 'test', password: '123456' }).then(data => {
  console.log('登录成功:', data);
});

  const b = async () => {
    const user={
      id : 1,
      name : 'name',
      sex : '男',
      age : 18,
    }    
const b1 =await etherreq.post('/add',user);
console.log(b1);
  };

// 登录方法（自动保存 token）
etherreq                                                                                                                                                                                                                                                             ;
  const login = async () => {
    const user={
    "id": 1,
    "username": "zhy",
    "password": "123456"
    }    
const login =await etherreq.login('users/login',user);
console.log(login);
  };


```





### 请求方法

etherreq.login(url,data)

etherreq.get（url,data）

etherreq.delete（url,data）

etherreq.head（url,data）

etherreq.options（url,data）

etherreq.post（url,data）

etherreq.put（url,data）

etherreq.patch（url,data）

在login方法执行后后端需要返回token，之后在执行其他方法时不需要配置token，token会自动携带