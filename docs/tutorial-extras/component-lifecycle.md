---
sidebar_position: 1
---

# 组件生命周期

理解组件的生命周期，至少有两个主要的理由：

- 遇到问题后，更容易知道从何诊断。
- 理解其他高级特性前，需要对组件生命周期有所理解。

![生命周期图示](/img/figure17-1.svg)

_Vue.js 3.x 生命周期图示_

## 创建阶段

这是生命周期的初始阶段。在这个阶段里，Vue.js 将创建组件新的实例，这包括属性的处理，比如：`data`，`computed` 属性。创建完组建后（但是在处理配置对象前），Vue.js 会调用 `beforeCreate` 方法。一旦 Vue.js 处理完它的配置对象（包括数据属性）后，就会调用 `created` 方法。

```typescript
<template>
  <p>Creation Phase</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const CreationPhase = defineComponent({
  data() {
    return {
      checked: true
    };
  },

  beforeCreate() {
    console.log(`beforeCreate method called ${this.checked}`);
  },

  created() {
    console.log(`created method called ${this.checked}`);
  }
});

export default CreationPhase;
</script>
```

输出如下：

```plain
beforeCreate method called undefined
created method called true
```

`beforeCreate` 方法被调用的时候，Vue.js 也只是才创建好了组件实例。此时，`this` 变量指向的就是组件本身。当 Vue.js 继续执行初始化的时候，`this` 会被设置 `data` 和 `computed` 属性，以及 `methods`。至此，创建阶段完成。

Vue.js 有一个重要特性就是反应式。当 `data` 属性发生变更时，变化会被传递给应用，从而触发 **计算属性**，**数据绑定**，**props** 的更新。所以，在创建阶段，每个 `data` 属性都会添加一个属性，就是 `getter` 和 `setter`。

## 挂载阶段

这是组件生命周期的第二个阶段。在这里，Vue.js 会处理组件的模板，数据绑定，指令，以及其他应用特性。

```typescript
<template>
  <p>Mounting Phase</p>

  <div>
    Names:
    <ul>
      <li v-for="name in names" v-bind:key="name">
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const MountingPhase = defineComponent({
  data() {
    return {
      names: [] as string[]
    };
  },

  mounted() {
    console.dir(this);
    (this.$attrs['data-names'] as string).split(',')
      .forEach((name: string) => this.names.push(name));
  }
});

export default MountingPhase;
</script>
```

```typescript
<MountingPhase data-names="Bob, Alice, Peter, Dora" />
```

## 更新阶段

## 卸载阶段

