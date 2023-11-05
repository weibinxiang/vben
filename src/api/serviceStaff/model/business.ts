export interface CreatePracticeUnitParams {
  /** 营业执照号 */
  business_license: string;
  /** 市 */
  city: string;
  /*** 单位类型 1咨询师事务所 2法律咨询公司 */
  firm_type: number;
  /** 执业照片 */
  license_photo: string;
  /** 机构logo */
  logo: string;
  /** 是否长期有效 1是 0否 */
  long_term: number;
  /** 单位全称 */
  name: string;
  /** 省 */
  province: string;
  /** 单位简称 */
  short_name?: string;
  /** 有效时间 开始时间 */
  valid_begin_time: string;
  /** 有效时间 结束时间 */
  valid_end_time: string;
}

export interface BusinessItem {
  /**
   * 营业执照
   */
  business_license: string;
  /**
   * 市
   */
  city: string;
  /**
   * 单位类型， 1咨询师事务所 2法律咨询公司
   */
  firm_type: number;
  /**
   * 执业单位id
   */
  law_firm_id: number;
  consultant_count: number;
  /**
   * 执照照片
   */
  license_photo: string;
  /**
   * 单位logo
   */
  logo: string;
  /**
   * 长期有效，1是 0否
   */
  long_term: number;
  /**
   * 单位名称
   */
  name: string;
  /**
   * 省
   */
  province: string;
  /**
   * 单位简称
   */
  short_name: string;
  /**
   * 状态，0禁用 1正常 2待审 3驳回
   */
  status: number;
  /**
   * 有效时间，开始时间
   */
  valid_begin_time: string;
  /**
   * 有效时间，结束时间
   */
  valid_end_time: string;
}
