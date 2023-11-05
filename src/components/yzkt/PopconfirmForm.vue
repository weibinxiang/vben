<template>
  <div>
    <Popover
      :visible="popconfirmVisible"
      :placement="placement"
      :getPopupContainer="getPopupContainer"
      :trigger="trigger"
      :overlayClassName="prefixCls"
      @visible-change="visibleChange"
    >
      <template #content>
        <slot name="title"></slot>
        <slot name="footer">
          <div class="text-right mb-0.5">
            <a-button @click="cancel">{{ cancelbuttonText }}</a-button>
            <a-button type="primary" class="ml-2" @click="confirm" :loading="okLoading">{{
              okButtonText
            }}</a-button>
          </div>
        </slot>
      </template>
      <slot name="text-btn"> </slot>
    </Popover>
  </div>
</template>

<script lang="ts">
  /**
   * 因Popover组件本身按钮点击确定后会直接关闭弹窗，用visible控制后点击空白处又不会关闭弹窗，所以自定义按钮
   */
  import { defineComponent, ref, watchEffect, PropType } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Popover } from 'ant-design-vue';

  const props = {
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    trigger: {
      type: String as PropType<'click' | 'contextmenu' | 'focus' | 'hover'>,
      default: 'click',
    },
    getPopupContainer: {
      default: function () {
        return () => {
          return document.body;
        };
      },
    },
    placement: {
      type: String as PropType<
        | 'left'
        | 'right'
        | 'bottom'
        | 'top'
        | 'bottomLeft'
        | 'bottomRight'
        | 'topLeft'
        | 'topRight'
        | 'leftTop'
        | 'leftBottom'
        | 'rightTop'
        | 'rightBottom'
      >,
      default: 'left',
    },
    okButtonText: {
      type: String as PropType<string>,
      default: '确认',
    },
    okLoading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    cancelbuttonText: {
      type: String as PropType<string>,
      default: '取消',
    },
    // 是否自定义取消按钮事件
    customCanel: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  };
  export default defineComponent({
    name: 'PopconfirmForm',
    components: {
      Popover,
    },
    props,
    setup(props, { emit: emits }) {
      const { prefixCls } = useDesign('popconfirm-form');
      const popconfirmVisible = ref();

      watchEffect(() => {
        popconfirmVisible.value = props.visible;
      });

      function confirm() {
        emits('confirm');
      }

      function cancel() {
        if (!props.customCanel) {
          emits('update:visible', false);
        }
        emits('cancel');
      }

      function visibleChange(val) {
        emits('update:visible', val);
      }

      return {
        prefixCls,
        popconfirmVisible,
        confirm,
        cancel,
        visibleChange,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-popconfirm-form';
  .@{prefix-cls} {
    .ant-form {
      padding: 6px 0;
    }
  }
</style>
