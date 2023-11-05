// import type { UploadBody } from 'cos-js-sdk-v5';

export interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}

export interface FileInfo {
  uuid: string;
  uploaded: boolean;
  file?: File;
  url?: string;
  tempPath?: string;
  error?: any;
}

export interface CropperProps {
  showRect?: Boolean; //预览方形
  showCircle?: Boolean; //预览圆形
  options?: {
    viewMode?: number;
    aspectRatio?: number;
    [propName: string]: any;
  };
}

export const uploadProps = {
  value: {
    type: [String, Array],
    default: '',
  },
  /* 本次选择的文件列表,可在关闭自动上传后自行处理文件 */
  fileList: {
    type: Array as PropType<FileInfo[]>,
    default: () => [],
  },
  width: {
    type: [Number, String],
    default: 240,
  },
  height: {
    type: [Number, String],
    default: 180,
  },
  title: {
    type: String,
    default: '上传图片',
  },
  name: {
    type: String,
    default: 'file',
  },
  subTitle: {
    type: String,
    default: '将文件拖拽至此区域',
  },
  accept: {
    type: String,
    default: 'image/gif,image/png,image/jpg,image/jpeg',
  },
  directory: {
    type: String,
    default: 'ketang-uploads/',
  },
  /* 上传体积上限,单位MB */
  maxSize: {
    type: Number,
    default: 2,
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /* 上传前是否需要触发裁剪 */
  needCropper: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /* 裁减配置 */
  cropper: {
    type: Object as PropType<CropperProps>,
    default: function () {
      /* 默认值 {
          showRect: true, //预览方形
          showCircle: false, //预览圆形
          options: {
            viewMode: 1,
            aspectRatio: 1,
          },
        }, */
      return {};
    },
  },
  autoUpload: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  clearStyle: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  isMedia: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  fileToBase64: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  onlyBtn: {
    // 纯按钮，不显示loading和preview
    type: Boolean as PropType<boolean>,
    default: false,
  },
  centered: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
};
