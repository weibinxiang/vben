<template>
  <div class="overflow-hidden relative">
    <input
      ref="excelUploadInput"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
      style="position: absolute; top: -999px; left: 100%"
    />
    <slot :handle-upload="handleUpload" :loading="loading">
      <a-button type="primary" ghost v-bind="buttonProps" :loading="loading" @click="handleUpload">
        {{ btnText }}
      </a-button>
    </slot>
  </div>
</template>
<script lang="ts" setup name="ExcelImport">
  import { ref, PropType } from 'vue';
  import * as XLSX from 'xlsx';

  defineProps({
    btnText: {
      type: String,
      default: '导入表格',
    },
    buttonProps: {
      type: Object as PropType<any>,
    },
  });

  const emits = defineEmits(['success']);

  const excelUploadInput = ref();
  const loading = ref(false);

  function handleUpload() {
    excelUploadInput.value?.click();
  }

  function handleClick(e) {
    const files = e.target.files;
    const rawFile = files[0]; // only use files[0]
    if (!rawFile) return;
    excelUploadInput.value.value = null; // fix can't select the same excel

    readerData(rawFile);
  }

  function readerData(rawFile) {
    loading.value = true;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const header = getHeaderRow(worksheet);
        const results = XLSX.utils.sheet_to_json(worksheet);

        emits('success', { header, results });
        loading.value = false;
        resolve({ header, results });
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsArrayBuffer(rawFile);
    });
  }

  function getHeaderRow(sheet) {
    const headers: string[] = [];
    const range = XLSX.utils.decode_range(sheet['!ref']);
    let C;
    const R = range.s.r;
    /* start in the first row */
    for (C = range.s.c; C <= range.e.c; ++C) {
      /* walk every column in the range */
      const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
      /* find the cell in the first row */
      let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
      if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
      headers.push(hdr);
    }
    return headers;
  }
</script>
