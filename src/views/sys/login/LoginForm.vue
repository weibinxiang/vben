<template>
  <!-- <h2 class="mb-4 text-xl font-semibold text-center enter-x xl:text-left">
    <span class="inline-block relative pb-2">
      手机号登录
      <span class="absolute left-0 bottom-0 bg-primary h-0.75 w-full"></span>
    </span>
  </h2> -->
  <div>
    <div class="text-[#212429] font-semibold leading-11 text-[32px] mb-2">{{
      formType === '1' ? '手机验证码登录' : '密码登录'
    }}</div>
    <div class="text-[#4E5969] font-medium leading-6 text-[16px] mb-6">请先选择您要登录的角色</div>
    <RadioGroup v-model:value="codeType" button-style="solid" class="!mb-6">
      <RadioButton value="agent" class="!mr-2 !rounded-[2px] w-[109px] h-8 text-center"
        >管理员</RadioButton
      >
      <RadioButton value="consultant" class="!mr-2 !rounded-[2px] w-[109px] h-8 text-center"
        >咨询师</RadioButton
      >
      <RadioButton value="customer" class="!rounded-[2px] w-[109px] h-8 text-center"
        >客服</RadioButton
      >
    </RadioGroup>
  </div>
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    @keypress.enter="formType =='1'?handleLogin():showPassLogin()"
  >
  <!-- 手机验证码登录 1 密码登录 2 -->
    <div v-if="formType == '1'">
      <FormItem name="phone" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.phone"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="code" class="enter-x">
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.code"
          :placeholder="t('sys.login.smsCode')"
          :sendCodeApi="sendCode"
        />
      </FormItem>
      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
          {{ t('sys.login.loginButton') }}
        </Button>
      </FormItem>
      <FormItem class="enter-x">
        <Button size="large" block @click="formType = '2'">
          {{ t('sys.login.passLoginButton') }}
        </Button>
      </FormItem>
    </div>
    <div v-if="formType == '2'">
      <FormItem name="phone" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.phone"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="password" class="enter-x">
     <div style="width: 100%">
      <InputPassword
          type="password"
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
          class="fix-auto-fill InputPassword "
        />
     </div>
        
      </FormItem>
      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="showPassLogin" :loading="loading">
          {{ t('sys.login.loginButton') }}
        </Button>
      </FormItem>
      <FormItem class="enter-x">
        <Button size="large" block @click="formType = '1'">
          {{ t('sys.login.phoneLoginButton') }}
        </Button>
      </FormItem>
    </div>

    <ARow class="enter-x">
      <!-- <ACol :span="12">
        <FormItem>
          No logic, you need to deal with it yourself
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol> -->
      <ACol :span="12">
        <!-- <FormItem :style="{ 'text-align': 'right' }">
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem> -->
      </ACol>
    </ARow>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';

  import { Form, Input, Row, Col, Button, Radio,InputPassword } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { CountdownInput } from '/@/components/CountDown';

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const codeType = ref<'agent' | 'consultant' | 'customer'>('agent');

  const formData = reactive({
    phone: '',
    code: '',
    password: '',
  });
 
  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  async function sendCode() {
    const data = await validForm().catch((err) => err);

    formRef.value.clearValidate(['code']);
    if (data.errorFields && data.errorFields.some((v) => v.name.includes('phone'))) {
      return false;
    }
    const sended = await userStore
      .sendSms(formData.phone)
      .then(() => true)
      .catch(() => false);
    return sended;
  }
  // 登录逻辑
  async function handleLogin() {
    const data = await validForm();

    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        type: '1',
        phone: data.phone,
        code: data.code,
        key: userStore.smsKey,
        login_role: codeType.value,
        mode: 'none', //不要默认的错误提示
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.name}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }
  // 验证吗登录: 1, 账号密码登录: 2
  const formType = ref<string>('2');
  async function showPassLogin() {
    const data = await validForm();

    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        type: '2',
        phone: data.phone,
        password: data.password,
        login_role: codeType.value,
        mode: 'none',
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.name}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }

</script>

<style scoped>
  ::v-deep(.ant-radio-button-wrapper:not(:first-child)::before) {
    width: 0;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    border-left-width: 1px;
  }




  @media (min-width: 1280px) {
    :deep(.InputPassword) input:not([type='checkbox']) {
    min-width:320px ;
    
}
  }


 




</style>
