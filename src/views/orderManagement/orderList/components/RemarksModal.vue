<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :width="572"
    :min-height="180"
    :title="`${dataValue.content ? '查看/编辑' : '添加备注'}`"
    okText="保存"
    :z-index="1111"
    centered
    :canFullscreen="false"
    wrapClassName="entity-details-modal"
    destroyOnClose
    :loading="loading"
    @ok="addRemarks()"
  >
    <div class="px-[10px] ok-2 pt-4">
      <Form
        :model="dataValue"
        ref="formRef"
        :labelCol="{ style: { width: '100px' } }"
        hideRequiredMark
      >
        <FormItem name="content" :rules="{ required: true, message: '请添加备注...' }">
          <div class="flex items-center">
            <a-textarea
              class="w-full h-36"
              v-model:value="dataValue.content"
              placeholder="请添加备注..."
              show-count
              :maxlength="200"
            />
          </div>
        </FormItem>
      </Form>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Form } from 'ant-design-vue';
  import { saveOrderRemark } from '/@/api/order/list';

  const loading = ref(false);
  const FormItem = Form.Item;
  const formRef = ref();
  const dataValue = ref({
    order_id: '',
    content: '',
  });

  const emits = defineEmits({
    onDel: () => true,
  });

  const [register, { closeModal }] = useModalInner((data) => {
    console.log('data', data);
    dataValue.value = data;
  });

  function addRemarks() {
    formRef.value.validate().then(() => {
      saveOrderRemark({
        remark: dataValue.value.content,
        order_id: dataValue.value.order_id,
      }).then(() => {
        dataValue.value.content = '';
      });
      closeModal();
      emits('onDel');
    });
  }
</script>
