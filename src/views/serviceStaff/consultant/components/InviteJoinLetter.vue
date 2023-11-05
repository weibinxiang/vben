<template>
  <BasicModal
    width="437px"
    :canFullscreen="false"
    v-bind="$attrs"
    title="邀请入驻"
    ok-text="下载"
    cancel-text="关闭"
    :min-height="520"
    @register="registerModal"
    :zIndex="1100"
    @ok="submit"
  >
    <div class="flex justify-center flex-col items-center">
      <!-- <div class="InviteJoinLetterBg relative">
        <div class="flex absolute left-16 top-26 text-sm font-semibold">
          <div class="mr-2 underline underline-offset-4 text-#AB8A72"
            >{{ inviteInfo.consultant_name }}咨询师</div
          >
          <div class="text-#000000">您好！</div>
        </div>
        <div class="absolute left-16 top-36 text-sm">
          <div class="mr-2 text-#AB8A72 w-40 leading-5">
            <span class="whitespace-nowrap text-#282727">非常荣幸邀请您加入</span>
            <span class="text-#4A4A4A font-semibold underline underline-offset-4 inline">
              {{ inviteInfo.label }}</span
            ></div
          >
        </div>
        <div class="w-full absolute left-0 top-50 h-100 flex justify-center">
          <img class="w-20 h-20" src="../../../../assets/images/qr-code.png" alt="" />
        </div>
      </div> -->
      <img :src="image" class="w-288px block mx-auto mt-2" />
      <div class="text-#86909C text-sm mt-5">生成的邀请函可在【邀请记录】-【查看邀请函】中查看</div>
      <div class="mt-3 text-#86909C"
        >联系不到咨询师？点击发送
        <a-button @click="openPhoneInviteJoin" type="link" class="!h-0 !p-0"
          >短信邀请</a-button
        ></div
      >
    </div>

    <!-- 咨询师手机号 -->
    <PhoneInviteJoin :phone="inviteInfo.phone" @register="registerPhoneInviteJoin" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import PhoneInviteJoin from './PhoneInviteJoin.vue';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import InviteJoinLetterBg from '/@/assets/images/InviteJoinLetterBg.png';
  import QrCodeImage from '/@/assets/images/qr-code.png';
  import { downloadByBase64 } from '/@/utils/file/download';
  import { useUserStore } from '/@/store/modules/user';

  const inviteInfo = ref<any>({});
  const image = ref('');
  const UserStore = useUserStore();
  const [registerModal] = useModalInner((data) => {
    inviteInfo.value = data.inviteInfo;
    drawPoster();
  });
  const [registerPhoneInviteJoin, { openModal: openPhoneInviteJoin }] = useModal();

  async function drawPoster() {
    const canvas = document.createElement('canvas');
    canvas.width = 750;
    canvas.height = 1120;
    const ctx = canvas.getContext('2d')!;
    // 绘制背景图
    const bgImage = await new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.crossOrigin = '*';
      image.src = InviteJoinLetterBg;
      image.onload = () => {
        resolve(image);
      };
    });
    ctx.drawImage(bgImage, 0, 0, 750, 1120);

    const nameX = 165;
    const nameY = 300;
    const nameInfo = drawUnderlineText(ctx, {
      text: inviteInfo.value.consultant_name,
      font: '40px bold',
      fillStyle: '#AB8A72',
      lineColor: '#AB8A72',
      x: nameX,
      y: nameY,
    });
    ctx.fillStyle = '#000';
    ctx.fillText('你好！', nameX + nameInfo.textWidth + 30, nameY);

    const labelX = 163;
    const labelY = 390;
    const labelText = '非常荣幸邀请您加入';
    ctx.fillStyle = '#4A4A4A';
    ctx.font = '32px normal';
    ctx.fillText(labelText, labelX, labelY);
    const labelTextWidth = ctx.measureText(labelText).width;
    const inviteLabel = UserStore.getUserInfo.name;
    const first = inviteLabel.substring(0, 4);
    const last = inviteLabel.substring(4);

    drawUnderlineText(ctx, {
      text: first,
      font: '32px bold',
      fillStyle: '#282727',
      lineColor: '#282727',
      x: labelX + labelTextWidth,
      y: labelY,
    });

    drawUnderlineText(ctx, {
      text: last,
      font: '32px bold',
      fillStyle: '#282727',
      lineColor: '#282727',
      x: labelX,
      y: labelY + 50,
    });

    const qrCode = await new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.crossOrigin = '*';
      image.src = QrCodeImage;
      image.onload = () => {
        resolve(image);
      };
    });
    ctx.drawImage(qrCode, 279, 526, 200, 200);

    image.value = canvas.toDataURL();
  }

  // 绘制下划线的文字（后续改需求的话可以考虑做成循环绘制）
  function drawUnderlineText(
    ctx: CanvasRenderingContext2D,
    opt: { font: string; fillStyle: string; text: string; x: number; y: number; lineColor: string },
  ) {
    const { font, fillStyle, text, x, y, lineColor } = opt;
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.fillText(text, x, y);
    const textWidth = ctx.measureText(text).width;
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x + textWidth, y + 10);
    ctx.stroke();
    return { textWidth };
  }

  function submit() {
    downloadByBase64(image.value, 'poster.jpg');
  }
</script>

<style scoped>
  .InviteJoinLetterBg {
    width: 288px;
    height: 431px;
    background: url('/src/assets/images/InviteJoinLetterBg.png') no-repeat 0 0 /100%;
  }
</style>
