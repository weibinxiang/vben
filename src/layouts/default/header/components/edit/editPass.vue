<template>
  <BasicModal
    :footer="null"
    :title="t('layout.header.phoneUserPasswordEdit')"
    v-bind="$attrs"
    :class="prefixCls"
    @register="register"
  >
    <div :class="`${prefixCls}__entry`">
      <div class="username">
        <div class="label">{{ t('layout.header.loginPhone') }}</div>
        <div class="value">{{ hiddenPhoneNumber }}</div>
      </div>

      <BasicForm @register="registerForm" />

      <div :class="`${prefixCls}__footer`">
        <a-button block class="mt-2 editBtn" @click="closeModal">
          {{ '取消' }}
        </a-button>
        <a-button type="primary" block class="mt-2 editBtn" @click="handleLock">
          {{ '保存' }}
        </a-button>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicModal, useModalInner } from '/@/components/Modal/index';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { loginupdateAgentPw } from '/@/api/sys/user';
  import { message, Modal } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import headerImg from '/@/assets/images/header.jpg';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useAppStore } from '/@/store/modules/app';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';

  export default defineComponent({
    name: 'EditPassModal',
    components: { BasicModal, BasicForm },
    setup() {
      const { t } = useI18n();
      const { prefixCls } = useDesign('header-edit-modal');
      const userStore = useUserStore();
      const getRealName = computed(() => userStore.getUserInfo?.name);
      const [register, { closeModal }] = useModalInner();
      const appStore = useAppStore();
      const permissionStore = usePermissionStore();
      const tabStore = useMultipleTabStore();
      const [registerForm, { validate, getFieldsValue }] = useForm({
        showActionButtonGroup: false,
        labelWidth: 80,
        schemas: [
          {
            field: 'code',
            label: t('layout.header.phoneCode'),
            colProps: {
              span: 24,
            },
            component: 'InputCountDown',
            required: true,
            componentProps: {
              placeholder: '请输入验证码',
              autocomplete: 'off',
              sendCodeApi: async () => {
                const sended = await userStore
                  .sendSms(`${useUserStore().userInfo?.phone}`)
                  .then(() => true)
                  .catch(() => false);
                return sended;
              },
            },
          },

          {
            field: 'password',
            component: 'StrengthMeter',
            colProps: {
              span: 24,
            },
            label: t('layout.header.newPassword'),
            rules: [
              { required: true, message: '请输入新密码' },
              {
                type: 'string',
                min: 6,
                max: 20,
                message: '请输入6-20位字符',
                trigger: 'blur',
              },
            ],
            componentProps: {
              placeholder: '请输入新密码',
              autocomplete: 'new-password',
            },
          },
          {
            field: 'subPassword',
            label: t('layout.header.successPassword'),
            colProps: {
              span: 24,
            },
            rules: [
              {
                validator: async (_, value: string) => {
                  const { password } = getFieldsValue();
                  if (!password) {
                    return Promise.reject('请先输入新密码');
                  } else if (value !== password) {
                    return Promise.reject('两次密码输入不一致');
                  }
                  return Promise.resolve();
                },
                trigger: 'change',
              },
            ],
            componentProps: {
              placeholder: '请输入确认密码',
            },
            component: 'InputPassword',
          },
        ],
      });
      const loading = ref(false);
      //保存
      async function handleLock() {
        // const values = (await validateFields()) as any;

        validate()
          .then((values) => {
            if (loading.value) return;
            Modal.confirm({
              title: '修改成功后需重新登录，请确认是否修改',
              onOk() {
                loading.value = true;

                loginupdateAgentPw({
                  code: values.code,
                  phone: useUserStore().userInfo?.phone,
                  key: userStore.smsKey,
                  password: values.password,
                  again_password: values.subPassword,
                })
                  .then(() => {
                    message.success('密码修改成功!');
                    // emits('onSuccess');
                    useUserStore().userInfo = null;
                    setTimeout(() => {
                      window.location.href = PageEnum.BASE_LOGIN;
                      localStorage.clear();
                      appStore.resetAllState();
                      permissionStore.resetState();
                      tabStore.resetState();
                      userStore.resetState();
                      location.reload();
                    }, 1000);
                  })
                  .finally(() => {
                    loading.value = false;
                  });
              },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      const avatar = computed(() => {
        const { avatar } = userStore.getUserInfo;
        return avatar || headerImg;
      });
      //手机号****处理

      function hideMiddleDigits(phone) {
        if (phone.length === 11) {
          const start = phone.substring(0, 3); // 获取前三位
          const middle = '****'; // 替换为****
          const end = phone.substring(7); // 获取后四位
          return start + middle + end;
        } else {
          return phone; // 如果手机号不是11位，不做处理
        }
      }

      const phoneNumber = useUserStore().userInfo?.phone;
      const hiddenPhoneNumber = hideMiddleDigits(phoneNumber);

      return {
        t,
        prefixCls,
        getRealName,
        register,
        registerForm,
        handleLock,
        closeModal,
        avatar,
        hiddenPhoneNumber,
      };
    },
  });
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-header-edit-modal';
  .@{prefix-cls} {
    &__entry {
      .username {
        display: flex;
        margin-bottom: 20px;

        .label {
          width: 80px;
          margin-right: 5px;
        }
      }
    }

    &__footer {
      display: flex;
      justify-content: space-evenly;

      .editBtn {
        width: 150px;
      }
    }
  }
</style>
