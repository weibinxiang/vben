<template>
  <BasicModal @register="register" @ok="modalConfirm(true)" @cancel="modalConfirm(false)">
    <div class="flex justify-between items-start">
      <div class="w-5/7 flex-shrink-0">
        <CropperImage
          ref="CropperImageRef"
          v-bind="cropperProps.prop"
          :src="image"
          height="360px"
          @cropend="handleCropend"
          v-if="image"
        />
      </div>
      <div class="flex flex-col items-end flex-1">
        <div class="border-1 border-gray-300 flex cursor-pointer mb-2" v-if="cropperProps.showRect">
          <AImage :src="cropperImg" :width="174" title="放大预览" />
        </div>
        <div
          class="border-1 border-gray-300 flex rounded-full overflow-hidden cursor-pointer"
          v-if="cropperProps.showCircle"
        >
          <AImage :src="cropperImg" :width="174" :height="174" title="放大预览" />
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, nextTick, computed } from 'vue';
  import { Image } from 'ant-design-vue';
  import { CropperImage } from '/@/components/Cropper';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { deepMerge } from '/@/utils/index';
  import { CropperProps } from './model';

  const AImage = Image;
  // const CropperImageRef = ref();
  const cropperImgInfo = ref('');
  const cropperImg = ref('');
  let cropperOptions = ref<CropperProps>();

  const image = ref('');
  let cropendCallback: (result: boolean, data?: any) => void;
  /* 从openModal读取启动参数,并完成初始化 */
  const [register, { setModalProps, closeModal }] = useModalInner((data) => {
    const { file, src, cropper, callback } = data;
    cropperOptions.value = cropper;
    nextTick(() => {
      if (src) {
        image.value = src;
      } else if (file) {
        getBase64(file, (res) => {
          image.value = res;
        });
      }
      cropendCallback = callback;
    });

    setModalProps({
      title: '裁剪图片',
      width: 700,
      maskClosable: false,
      canFullscreen: false,
      destroyOnClose: true,
    });
  });
  const cropperProps = computed((): CropperProps & { prop: any } => {
    const { showRect, showCircle, ...prop } = deepMerge(
      {
        showRect: true, //预览方形
        showCircle: false, //预览圆形
        options: {
          viewMode: 1,
          aspectRatio: 1,
        },
      },
      cropperOptions.value,
    );

    return { showRect, showCircle, prop };
  });

  function modalConfirm(type) {
    if (type) {
      // await CropperImageRef.value.checkFileSize();
      cropendCallback(true, cropperImg.value);
    } else {
      cropendCallback(false);
    }
    image.value = '';
    closeModal();
  }

  function handleCropend({ imgBase64, imgInfo }) {
    cropperImgInfo.value = imgInfo;
    cropperImg.value = imgBase64;
  }
  function getBase64(img: Blob | File, callback: (base64Url: string) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  }
</script>
