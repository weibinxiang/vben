<template>
  <div :style="getWarpperStyle" :class="{ 'clear-upload-style': clearStyle }" ref="uploadRef">
    <a-upload
      :file-list="_fileList"
      :name="name"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      action=""
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled || loading"
      :before-upload="beforeUpload"
      :customRequest="handleUpload"
    >
      <div class="w-full" :class="{ 'h-full flex flex-col items-center justify-center': centered }">
        <slot v-if="previewSrc && !onlyBtn" name="preview">
          <img :src="previewSrc" class="preview-image w-full h-full" alt="avatar" />
          <div
            class="absolute left-0 top-0 w-full h-full bg-black bg-opacity-50 opacity-0 flex items-center justify-center cursor-auto hover:opacity-100 text-white text-xl"
            @click.stop
            v-if="!disabled"
          >
            <delete-outlined class="cursor-pointer" title="删除" @click.stop="clearImage" />
            <div class="mx-3 bg-white w-1px h-20px"></div>
            <eye-outlined
              class="cursor-pointer"
              title="预览"
              @click.stop="createImgPreview({ imageList: [previewSrc] })"
            />
          </div>
        </slot>
        <slot v-else>
          <div v-if="loading && !onlyBtn">
            <Progress type="circle" :percent="percent" :width="42" trailColor="#cccccc" />
            <div v-if="propsFilesLength > 1 && multiple">
              {{ uploadedLength }} / {{ propsFilesLength }}
            </div>
          </div>
          <div class="text-gray-600" v-else>
            <Icon :size="24" icon="ant-design:plus-outlined" />
            <div class="mt-1" :class="[height > 120 ? 'text-base' : '']">{{ title }}</div>
            <div class="text-sm text-gray-300 mt-1" v-if="height >= 120">{{ subTitle }}</div>
          </div>
        </slot>
      </div>
    </a-upload>
    <cropper-image @register="register" />
  </div>
</template>
<script lang="ts">
  import { ref, watch, computed, defineComponent, onMounted } from 'vue';
  import { EyeOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { Icon } from '/@/components/Icon';
  import { message, Upload, Modal, Progress } from 'ant-design-vue';
  import { buildShortUUID } from '/@/utils/uuid';
  import { dataURLtoFile } from '/@/utils/file/base64Conver';
  import { debouncedWatch } from '@vueuse/core';
  import { createImgPreview } from '/@/components/Preview';
  import CropperImage from './CropperImage.vue';
  import ossUpload from '/@/components/yzkt/ossUpload';
  import { useModal } from '/@/components/Modal';
  import { uploadProps } from './model';
  import type { FileInfo, FileItem } from './model';

  export default defineComponent({
    name: 'YzktUpload',
    components: {
      EyeOutlined,
      DeleteOutlined,
      Icon,
      CropperImage,
      Progress,
      [Upload.name]: Upload,
    },
    props: uploadProps,
    emits: ['update:value', 'update:fileList', 'on-progress', 'select-change'],
    setup(props, { emit: emits }) {
      const [register, { openModal }] = useModal();

      const getWarpperStyle = computed(() => {
        const reg = /^[0-9]+$/;
        return {
          width: reg.test(props.width.toString()) ? props.width + 'px' : props.width,
          height: reg.test(props.height.toString()) ? props.height + 'px' : props.height,
        };
      });

      const previewSrc = computed<string>(() => {
        return typeof props.value === 'string' ? props.value : '';
      });
      const uploadRef = ref();
      const loading = ref<boolean>(false);
      const _fileList = ref<FileInfo[]>(props.fileList);
      const propsFilesLength = computed(() => _fileList.value.length);
      const uploadedLength = computed(() => _fileList.value.filter((v) => v.uploaded).length + 1);
      const percent = ref<number>(0);
      const singleFileList = ref<FileInfo[]>([]);

      onMounted(() => {
        /**
         * @description 移动端下，上传input携带了capture属性会导致点击默认打开相机，所以通过原生js移除属性
         */
        uploadRef.value?.querySelector('input[type=file]')?.removeAttribute('capture');
      });
      // 从父组件直接改变了props.fileList的对象内存地址时，以props优先
      watch(
        () => props.fileList,
        (values) => {
          if (_fileList.value !== values) _fileList.value = values;
        },
      );
      // _fileList变化后，传递给父组件
      watch(_fileList, (values) => {
        emits('update:fileList', values);
      });
      // 选取的文件后，判断是否自动开始上传
      debouncedWatch(
        () => _fileList.value.length,
        (len) => {
          if (len && props.autoUpload) {
            customUploadFile({ index: 0 });
          }
        },
        { debounce: 300 },
      );
      // 当前次选择的文件向父组件传递
      debouncedWatch(
        () => singleFileList.value.length,
        (len) => {
          if (len) {
            emits('select-change', [...singleFileList.value]);
          }
          singleFileList.value = [];
        },
        { debounce: 300 },
      );

      interface customUploadParams {
        index: number; // 用于处理多文件场景下的顺序上传
        onEnd?: (result: Array<FileInfo>) => void;
      }

      function customUploadFile(options: customUploadParams) {
        loading.value = true;
        const listLength = _fileList.value.length;

        const uploadFn = (index) => {
          const info = _fileList.value[index];
          if (info.url || !info.file) {
            if (info.url) {
              _fileList.value[index].url = info.url;
            }
            info.uploaded = true;
            if (index === listLength - 1) {
              // 最后的文件是不需要上传的，按成功结束，停止递归
              emits(
                'update:value',
                props.multiple
                  ? _fileList.value.map((v) => v.url)
                  : _fileList.value[listLength - 1].url,
              );
              percent.value = 0;
              loading.value = false;
              options.onEnd && options.onEnd(_fileList.value);
              return false;
            }
            return uploadFn(index + 1);
          }
          const itemIndex = _fileList.value.findIndex((v) => v.uuid === info.uuid);
          ossUpload(info.file!, {
            fileType: props.isMedia ? 1 : 2,
            dir: props.directory,
            onProgress(_percent) {
              percent.value = _percent;
              emits('on-progress', { index, percent: _percent });
            },
          })
            .then((url) => {
              _fileList.value[itemIndex].url = url;
              _fileList.value[itemIndex].uploaded = true;
            })
            .catch((err) => {
              _fileList.value[itemIndex].error = err;

              if (_fileList.value[itemIndex].error && _fileList.value[itemIndex].uploaded) {
                Modal.error({
                  title: () => '图片上传失败',
                  content: () => JSON.stringify(err),
                });
              }
            })
            .finally(() => {
              if (_fileList.value[itemIndex].error && !_fileList.value[itemIndex].uploaded) {
                // 如果错误会重试一次上传
                uploadFn(index);
                _fileList.value[itemIndex].uploaded = true;
              } else if (index === listLength - 1) {
                /* 文件列表内的文件全部上传完成,停止递归 */
                emits(
                  'update:value',
                  props.multiple
                    ? _fileList.value.map((v) => v.url)
                    : _fileList.value[listLength - 1].url,
                );
                percent.value = 0;
                loading.value = false;
                options.onEnd && options.onEnd(_fileList.value);
              } else {
                /* 否则递归继续上传 */
                uploadFn(index + 1);
              }
            });
        };

        uploadFn(options.index);
      }

      const handleUpload = (info) => {
        if (info.file) {
          const item = {
            uuid: buildShortUUID(),
            uploaded: false,
            file: info.file,
            url: '',
            tempPath:
              props.fileToBase64 && URL?.createObjectURL ? URL.createObjectURL(info.file) : '',
          };
          _fileList.value = [..._fileList.value, item];
          singleFileList.value.push(item);

          if (props.autoUpload) {
            loading.value = true;
          }
        }
      };

      const beforeUpload = (file: FileItem) => {
        const maxSize = 1048576 * props.maxSize;
        if (props.accept) {
          const accepts = props.accept.split(',').map((v) => {
            return v.trim();
          });
          if (!accepts.includes(file.type as string)) {
            message.warning(
              `仅支持以下文件类型: ${accepts.map((v) => v.split('/')[1]).join('、')}`,
            );
            return false;
          }
        }
        if (file.size > maxSize) {
          message.warning(`上传文件大小不能超过 ${props.maxSize}MB !`);
          return false;
        }
        if (props.needCropper) {
          return transformFile(file);
        }
        return true;
      };
      /* 上传前判断是否需要裁减图片 */
      const transformFile = (file: FileItem) => {
        return new Promise((resolve, reject) => {
          openModal(true, {
            file,
            cropper: props.cropper,
            callback(result, data) {
              if (result) {
                resolve(dataURLtoFile(data, file.name));
              } else {
                reject('取消裁剪');
              }
            },
          });
        });
      };

      const clearImage = (uuid) => {
        if (uuid && props.multiple) {
          const index = _fileList.value.findIndex((v) => v.uuid === uuid);
          if (index !== -1) {
            _fileList.value.splice(index, 1);
          }
          emits(
            'update:value',
            _fileList.value.map((v) => v.url),
          );
        } else {
          emits('update:value', '');
        }
      };

      return {
        register,
        previewSrc,
        getWarpperStyle,
        createImgPreview,
        _fileList,
        loading,
        percent,
        handleUpload,
        beforeUpload,
        clearImage,
        customUploadFile, // 手动上传方法
        propsFilesLength,
        uploadedLength,
        uploadRef,
      };
    },
  });
</script>
<style lang="less">
  .avatar-uploader {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;

    .ant-upload {
      position: absolute;
      width: 100%;
      height: 100%;

      &.ant-upload-select-picture-card {
        width: 100%;
        height: 100%;
        background-color: #f2f3f5;

        i {
          color: #999;
          font-size: 32px;
        }
      }
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .clear-upload-style {
    .ant-upload {
      margin: 0;
      padding: 0 !important;
      border: none;
    }
  }
</style>
