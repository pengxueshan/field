### 关于真值比较
```javascript
if ('0') alert("'0' is true");
if ('0' == false) alert("'0' is false");
```
结果是，两次都 alert 了！那么 '0' 到底是 true 还是 false 呢？
在js做比较的时候，有这样的三条规则：
+ 如果比较的两者中有bool，会把 bool 先转换为对应的 number，即 0 和 1；
+ 如果比较的双方中有一方为number一方为string，会把string转换为数字；
+ 把string直接转换为bool的时候，空字符串‘’转换为 false，除此外的一切字符串转换为 true；

第二次比较的时候，先把false转换为数字0，然后把'0'转换为数字为0，0==0成立