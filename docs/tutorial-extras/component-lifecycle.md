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
    (this.$attrs['data-names'] as string)
      .split(',')
      .forEach((name: string) => this.names.push(name));
  }
});

export default MountingPhase;
</script>
```

```typescript
<MountingPhase data-names="Bob, Alice, Peter, Dora" />
```

如果组件需要访问 DOM，那么可以借助于 `mounted` 事件，它用于指示组件内容已被处理。但是需要注意的是，任何应用到 Vue.js 组件上的 HTML 属性，都会体现在模板的顶级元素上。 

## 更新阶段

一旦组件完成初始化并且挂载完了内容，那么就会进入更新阶段，此时 Vue.js 会相应 `data` 属性的变更。当一旦侦测到变更，Vue.js 就会调用 `beforeUpdate` 方法，而完成了更新之后（体现在 HTML 内容上的变化）就会调用 `update` 方法。

```typescript
<template>
  <div>
    <p>Update Phase</p>

    <div>
      Names:
      <ul>
        <li v-for="name in names" v-bind:key="name">
          {{ name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const UpdatePhase = defineComponent({
  data() {
    return {
      checked: false,
      names: [] as string[]
    };
  },

  mounted() {
    this.checked = true;

    (this.$attrs['data-names'] as string)
      .split(',')
      .forEach(name => this.names.push(name));
  },

  beforeUpdate() {
    console.log(`beforeUpdate called. Checked: ${this.checked}, Name: ${this.names[0]}, List Elements: ${this.$el.getElementsByTagName('li').length}`);
  },

  updated() {
    console.log(`updated called. Checked: ${this.checked}, Name: ${this.names[0]}, List Elements: ${this.$el.getElementsByTagName('li').length}`);
  }
});

export default UpdatePhase;
</script>
```

```typescript
<UpdatePhase data-names="Bob, Alice, Peter, Dora" />
```

输出如下：

```plain
beforeUpdate called. Checked: true, Name: Bob, List Elements: 0
updated called. Checked: true, Name: Bob, List Elements: 4
```

:::caution
在 `beforeUpdate` 方法调用时，组件 `data` 属性中的值已发生变更，只是 DOM 结构没有开始发生变化，所以 `updated` 提示的是 DOM 结构已完成更新。
:::

### 更新合并

在上述例子中，对数组 `names` 执行了多次添加操作，以及对 `checked` 也重新赋了值，但是只触发了一次 `beforeUpdate` 和 `updated` 方法。这就是 Vue.js 争对数据更新所做的更新合并操作，这是为了性能的提升。

:::tip
`beforeUpdate` 和 `updated` 方法仅在数据变更会导致 HTML 元素改变时才会触发。所以在上述例子中，如果注销了 `mounted` 方法中向 `names` 数组中添加数据的部分，即使对 `checked` 做了修改，也不会触发这两个方法的调用。
:::

### 更新后期回调：nextTick

Vue.js 提供了一个 `Vue.nextTick` 方法，它可以用于在所有变更都执行完成了之后，再执行它当中定义的任务。

```typescript
<template>
  <div>
    <p>Update Phase</p>

    <div>
      Names:
      <ul>
        <li v-for="name in names" v-bind:key="name">
          {{ name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const UpdatePhase = defineComponent({
  data() {
    return {
      checked: false,
      names: [] as string[]
    };
  },

  mounted() {
    this.checked = true;

    (this.$attrs['data-names'] as string)
      .split(',')
      .forEach(name => this.names.push(name));

    this.$nextTick(() => {
      console.log('Callback Invoked');
    });
  },

  beforeUpdate() {
    console.log(`beforeUpdate called. Checked: ${this.checked}, Name: ${this.names[0]}, List Elements: ${this.$el.getElementsByTagName('li').length}`);
  },

  updated() {
    console.log(`updated called. Checked: ${this.checked}, Name: ${this.names[0]}, List Elements: ${this.$el.getElementsByTagName('li').length}`);
  }
});

export default UpdatePhase;
</script>
```

输出如下：

```plain
beforeUpdate called. Checked: true, Name: Bob, List Elements: 0
updated called. Checked: true, Name: Bob, List Elements: 4
Callback Invoked
```

### 关注数据变更：watcher

`beforeUpdate` 和 `update` 方法会告诉你组件的 HTML 元素发生了更新，但不会告诉你哪一个属性发生了变化。特别是在当一个 `data` 的属性变化不会引起 HTML 变化的时候，更难知道哪些数据发生变化。如果这时候，想要接收到数据属性的变化，就需要使用到 `watcher`。

```typescript
<template>
  <div>
    <p>Update Phase</p>

    <div>
      Names:
      <ul>
        <li v-for="name in names" v-bind:key="name">
          {{ name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const UpdatePhase = defineComponent({
  data() {
    return {
      checked: false,
      names: [] as string[]
    };
  },

  mounted() {
    this.checked = true;

    (this.$attrs['data-names'] as string)
      .split(',')
      .forEach(name => this.names.push(name));
  },

  beforeUpdate() {
    console.log(`beforeUpdate called. Checked: ${this.checked}, Name: ${this.names[0]}, List Elements: ${this.$el.getElementsByTagName('li').length}`);
  },

  updated() {
    console.log(`updated called. Checked: ${this.checked}, Name: ${this.names[0]}, List Elements: ${this.$el.getElementsByTagName('li').length}`);
  },

  watch: {
    checked(newVal, oldVal) {
      console.log(`Checked Watch, Old: ${oldVal}, New: ${newVal}`);
    }
  }
});

export default UpdatePhase;
</script>
```

输出如下：

```plain
Checked Watch, Old: false, New: true
beforeUpdate called. Checked: true, Name: Bob, List Elements: 0
updated called. Checked: true, Name: Bob, List Elements: 4
```

我们知道，在上面的示例中，`checked` 属性变化，是不会体现在 `beforeUpdate` 或者 `updated` 方法中的，但是通过 `watch`，我们可以精准监测属性值的前后变化。除此之外，我们要注意到 `watch` 中的监听方法会在 `beforeUpdate` 和 `update` 方法之前调用。

## 卸载阶段

组件生命周期的最后阶段就是卸载，Vue.js 在组件即将卸载前调用 `beforeUnmount` 方法，在这里面，可以执行一些卸载前的操作，比如事件监听。卸载完成之后，则会调用 `unmounted` 方法，至此，已经移除监听器，事件处理器，以及组件的子组件。

```typescript title="MessageDisplay.vue"
<template>
  <div>
    <p>Count: {{ counter }}</p>
    <button @click="handleIncrement">Increment</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const MessageDisplay = defineComponent({
  data() {
    return {
      counter: 0
    };
  },

  created() {
    console.log('MessageDisplay: created');
  },

  beforeUnmount() {
    console.log('MessageDisplay: beforeUnmount');
  },

  unmounted() {
    console.log('MessageDisplay: unmounted');
  },

  methods: {
    handleIncrement() {
      this.counter += 1;
    }
  }
});

export default MessageDisplay;
</script>
```

```typescript title="UnmountingPhase.vue"
<template>
  <div>
    <div>
      <input type="checkbox" v-model="checked" />
      <label>Checkbox</label>
    </div>
    <p>Checked Value: {{ checked }}</p>
    <div v-if="checked">
      <MessageDisplay />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MessageDisplay from './MessageDisplay.vue';

const UnmountingPhase = defineComponent({
  components: {
    MessageDisplay
  },

  data() {
    return {
      checked: false
    };
  }
});

export default UnmountingPhase;
</script>
```

如果取消勾选，就会看到如下输出：

```plain
MessageDisplay: created
MessageDisplay: beforeUnmount
MessageDisplay: unmounted
```