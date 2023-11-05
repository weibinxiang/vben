<template>
  <div
    class="p-4 pb-0 serve-item cursor-pointer"
    @click="selectServe(item)"
    @animationend="animationend"
    :class="{
      'bg-#EBF3FF': item.consulting_id === StagingStore.currentServe?.consulting_id,
      'serve-finish': item.finish,
    }"
  >
    <div class="flex justify-between text-xs">
      <div class="text-#86909C truncate pr-2"
        >【{{ item.type === ConsultingType.phone ? '电话' : '图文' }}咨询】<span
          v-if="UserStore.getRoleList.includes(RoleEnum.customer)"
        >
          {{ item.consultant_name }}咨询师</span
        ><span
          v-if="
            UserStore.getRoleList.includes(RoleEnum.customer) &&
            !(
              item.type === ConsultingType.phone &&
              getServeStatus(item.phase) === ServeStatus.ongoing
            )
          "
          >：</span
        ><span v-if="getServeStatus(item.phase) === ServeStatus.wait"
          >等待{{ formatTime(item.wait_minutes) }}
        </span>
        <span
          v-else-if="
            getServeStatus(item.phase) === ServeStatus.ongoing && item.type !== ConsultingType.phone
          "
          >剩余{{ formatTime(item.left_minutes) }}</span
        >
      </div>

      <div class="flex-shrink-0">
        <Badge
          color="#F53F3F"
          text="待接单"
          class="!text-#F53F3F"
          v-if="getServeStatus(item.phase) === ServeStatus.wait"
        />
        <Badge
          color="#165DFF"
          text="咨询中"
          class="!text-#165DFF"
          v-else-if="getServeStatus(item.phase) === ServeStatus.ongoing"
        />
        <Badge
          color="#00B42A"
          text="已完成"
          class="!text-#00B42A"
          v-else-if="getServeStatus(item.phase) === ServeStatus.success"
        />
        <Badge
          color="#4E5969"
          text="已取消"
          class="!text-#4E5969"
          v-else-if="getServeStatus(item.phase) === ServeStatus.refund"
        />
      </div>
    </div>
    <div class="flex mt-3">
      <div class="flex mr-3 relative">
        <Avatar :src="item.user_headimg_url" :role="RoleEnum.user" alt="" class="w-10 h-10" />
        <div
          v-if="item.unread_records && isServeing"
          class="w-5 h-5 rounded-full border-1 border-solid border-white text-white flex items-center justify-center absolute -right-2 -top-2 bg-#F53F3F leading-none"
          >{{ item.unread_records }}</div
        >
      </div>
      <div class="flex-1 overflow-hidden">
        <div class="flex items-center">
          <div
            v-if="isServeing"
            class="text-#23C343 flex-shrink-0 text-xs"
            :class="{ '!text-#C9CDD4': !item.is_online }"
            >【 {{ item.is_online ? '在线' : '离线' }}】</div
          >
          <div class="flex-1 truncate font-bold">{{ item.user_nickname || '未设置' }}</div>
          <div class="flex-shrink-0 text-#86909C text-xs" v-if="isServeing">{{
            formatDate(item.record_time)
          }}</div>
        </div>
        <div class="truncate text-#4E5969 text-xs font-medium mt-1" v-if="isServeing">{{
          msgText
        }}</div>
        <div class="truncate text-#4E5969 text-xs font-medium mt-1" v-else
          ><span class="text-gray-400">下单时间：</span>{{ item.created_at }}</div
        >
      </div>
    </div>
    <div class="mx-2 h-1px bg-#eee mt-4"></div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, computed } from 'vue';
  import { Badge } from 'ant-design-vue';
  import { ConsultingRecords, OrderConsultings } from '/@/api/staging/model/customerModel';
  import {
    ConsultingType,
    RecordTypeEnum,
    ServeStatus,
    ServeTypeEnum,
    PhaseEnum,
  } from '/@/api/staging/model/enum';
  import {
    consultingNoticeText,
    customNoticeText,
    systemNotice,
  } from '../../chat/src/message/hooks/useMssageNotice';
  import { useStagingStore } from '/@/store/modules/staging';
  import { useUserStore } from '/@/store/modules/user';
  import { formatTime } from '/@/utils';
  import { RoleEnum } from '/@/enums/roleEnum';
  import dayjs from 'dayjs';
  import Avatar from '../../avatar/Avatar.vue';

  const props = defineProps({
    item: {
      type: Object as PropType<Partial<ConsultingRecords & OrderConsultings>>,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
  });
  const emits = defineEmits({
    pushOrder: () => true,
  });
  const StagingStore = useStagingStore();
  const UserStore = useUserStore();
  const { getServeStatus } = StagingStore;
  const currentYear = dayjs().year();

  const msgText = computed(() => {
    const item = props.item as ConsultingRecords;
    let text = '';
    if (item.sender === 'notice') {
      const notice = UserStore.getRoleList.includes(RoleEnum.customer)
        ? customNoticeText
        : consultingNoticeText;
      text = `【温馨提示】: ${notice[item.notice] || ''}`;
    } else if (item.sender === 'system') {
      text = `【系统通知】: ${systemNotice[item.operation] || ''}`;
    } else if (
      item.record_type === RecordTypeEnum.dial_caller_cut ||
      item.record_type === RecordTypeEnum.dial_callee_cut
    ) {
      text = '【通话已挂断】';
    } else if (item.record_type === RecordTypeEnum.dial_no_answer) {
      text = '【通话未接听】';
    } else if (item.record_type === RecordTypeEnum.dial_refuse) {
      text = '【通话已拒绝】';
    } else if (item.record_type === RecordTypeEnum.dial_cancel) {
      text = '【通话已取消】';
    } else if (item.record_type === RecordTypeEnum.dial_service_timeout) {
      text = '【服务超时】';
    } else if (item.record_type === RecordTypeEnum.image) {
      text = '【图片】';
    } else if (item.record_type === RecordTypeEnum.audio) {
      text = '【语音】';
    } else if (item.record_type === RecordTypeEnum.text) {
      text = item.record_content;
    }

    return text;
  });

  const isServeing = computed(() => {
    const phase = props.item.phase;
    return (
      getServeStatus(phase) === ServeStatus.wait || getServeStatus(phase) === ServeStatus.ongoing
    );
  });

  function selectServe(item) {
    StagingStore.changeCurrentServe(item);
  }

  function formatDate(date) {
    const d = dayjs(date);
    if (d.year() === currentYear) {
      return d.format('MM-DD HH:mm:ss');
    } else {
      return date;
    }
  }

  function animationend(e) {
    if (e.animationName === 'serve-finish-animation') {
      const [item] = StagingStore.serveList[ServeTypeEnum.ongoing].splice(props.index, 1) as [
        Partial<ConsultingRecords> & Partial<OrderConsultings>,
      ];
      item.phase = PhaseEnum.consultant_finish;
      item.status = ServeStatus.success;
      item.created_at = StagingStore.consulting?.created_at;
      StagingStore.currentServe = undefined;
      StagingStore.serveList[ServeTypeEnum.history].unshift(item);
      item.finish = false;
      emits('pushOrder');
    }
  }
</script>

<style lang="less">
  .serve-item {
    .ant-badge-status-text {
      color: inherit;
      font-size: 12px;
    }
  }

  .serve-finish {
    animation: serve-finish-animation 0.5s ease-out 0.2s forwards;
  }

  @keyframes serve-finish-animation {
    0% {
      transform: translateX(0);
      opacity: 1;
    }

    100% {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
</style>
