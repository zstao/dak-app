### 主要接口函数

---

model-interface.js
    - get(conds, fields, opts, query)

    > 根据 conds,opts 进行数据库查询，返回 promise， 通过promise#then(onfulfill)
    > 获取查询结果，结果为数组类型。 具体使用看该函数的注释说明
    - getPage()


---

具体使用案例见 函数定义的说明