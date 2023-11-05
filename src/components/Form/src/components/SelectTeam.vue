<template><ApiSelect v-bind="attrs" v-model:value="state" /></template>

<script lang="ts">
  import { defineComponent, PropType, computed, unref } from 'vue';
  import { useAttrs } from '@vben/hooks';
  import ApiSelect from './ApiSelect.vue';
  // import { CurriculumParamsStatus, CurriculumParamsPackage } from '/@/api/marketing/model';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { merge } from 'lodash-es';
  import { getGroups } from '/@/api/order/list';

  export default defineComponent({
    name: 'SelectCurriculum',
    components: {
      ApiSelect,
    },
    props: {
      value: {
        type: [String, Number] as PropType<string | number>,
      },
      status: {
        type: [String, Number] as PropType<string | number>,
      },
      searchKey: {
        type: [String, Number] as PropType<string | number>,
      },
    },
    setup(props) {
      const _attrs = useAttrs();
      const default_attrs = {
        api: getGroups,
        params: { status: props.status, search_key: props.searchKey },
        hasOptGroup: true,
        labelField: 'name',
        valueField: 'group_id',
        showSearch: true,
        filterOption: (val, option) => option.label.indexOf(val) !== -1,
        style: { minWidth: '200px' },
      };

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props);
      const attrs = computed(() => {
        return merge(default_attrs, unref(_attrs));
      });
      // Processing options value
      return { state, attrs };
    },
  });
</script>
