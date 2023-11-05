<template><ApiSelect v-bind="attrs" v-model:value="state" /></template>

<script lang="ts">
  import { defineComponent, PropType, computed, unref } from 'vue';
  import { useAttrs } from '@vben/hooks';
  import ApiSelect from './ApiSelect.vue';
  // import { getAuthorCurriculumListApi } from '/@/api/marketing/coursePackage';
  // import { CurriculumParamsStatus, CurriculumParamsPackage } from '/@/api/marketing/model';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { merge } from 'lodash-es';

  export default defineComponent({
    name: 'SelectCurriculum',
    components: {
      ApiSelect,
    },
    props: {
      value: {
        type: [String, Number] as PropType<string | number>,
      },
    },
    setup(props) {
      const _attrs = useAttrs();
      const default_attrs = {
        // api: getAuthorCurriculumListApi,
        // params: { status: CurriculumParamsStatus.all, is_package: CurriculumParamsPackage.all },
        hasOptGroup: true,
        labelField: 'name,title',
        valueField: 'curriculum,curriculum_id',
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
