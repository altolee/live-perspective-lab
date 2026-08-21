"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { localeLabels, translate, useDocumentLocalization, type Locale } from "./i18n";

type RoleKey = "patient" | "partner" | "nurse";
type StanceKey = "super" | "distract" | "blame" | "please" | "congruent";
type ViewKey = "presenter" | "participant";
type ScenarioKey = "maternity" | "campus" | "thoracic" | "medication" | "wardconflict";
type Scenario = {
  key: ScenarioKey; eventCode: string; number: string; switchLabel: string;
  image: string; qr: string; imageAlt: string; presenterEyebrow: string;
  captionLabel: string; captionQuote: string;
  roles: Record<RoleKey, { label: string; short: string; icon: string; color: string; quote: string; need: string }>;
  behaviors: Record<RoleKey, string[]>; emotions: string[];
  statements: Record<RoleKey, Record<StanceKey, string>>;
};
type SurveySession = { sequenceNo: number; status: "active" | "closed"; startedAt: string; endedAt: string | null };
type LiveResponse = { role: RoleKey; behaviors: string[]; emotions: string[]; stance: StanceKey | null; stage?: "role" | "iceberg" | "stance" | "complete" };
type LiveStats = { roleCounts: Record<RoleKey, number>; icebergCompleted: Record<RoleKey, number>; behaviorCompleted: Record<RoleKey, number>; emotionCompleted: Record<RoleKey, number>; behaviorCounts: Record<RoleKey, number[]>; emotionCounts: Record<RoleKey, number[]>; stanceCounts: Record<RoleKey, Record<StanceKey, number>> };

const maternityRoles: Scenario["roles"] = {
  patient: { label: "焦虑的孕妇", short: "孕妇", icon: "孕", color: "coral", quote: "我很痛，也不知道还要等多久。", need: "安全、被看见、可预期" },
  partner: { label: "急躁的伴侣", short: "伴侣", icon: "伴", color: "amber", quote: "我不能什么都不做，我必须保护她。", need: "掌控、信息、能够帮上忙" },
  nurse: { label: "一线护士", short: "护士", icon: "护", color: "blue", quote: "我要照顾他们，也不能漏掉任何风险。", need: "秩序、专业边界、被信任" },
};

const maternityBehaviors: Scenario["behaviors"] = {
  patient: ["反复询问医生何时来", "紧抓腹部、呼吸急促", "语速变快并提高音量", "不断确认宝宝是否安全", "沉默流泪、拒绝回应"],
  partner: ["催促柜台立即处理", "打断护士的说明", "在走廊来回踱步", "拿手机查询并质疑流程", "转身安抚孕妇"],
  nurse: ["快速重复医疗流程", "先确认疼痛与危险征象", "保持距离并简短回答", "邀请伴侣一起整理信息", "暂停对话寻求同事支持"],
};

const maternityEmotions = ["焦虑", "害怕", "无助", "愤怒", "委屈", "不确定", "孤单", "挫折", "内疚", "渴望被理解"];

const stances: Record<StanceKey, { label: string; note: string; color: string }> = {
  super: { label: "超理智", note: "只谈规则与道理，与感受保持距离", color: "#315c8a" },
  distract: { label: "打岔", note: "转移焦点，避开当下的压力", color: "#8b6aa8" },
  blame: { label: "指责", note: "用攻击拿回控制感", color: "#be3e35" },
  please: { label: "讨好", note: "压下自己的需要以维持关系", color: "#d98f35" },
  congruent: { label: "一致性", note: "同时照顾自己、他人与情境", color: "#2f745a" },
};

const maternityStatements: Scenario["statements"] = {
  patient: {
    super: "依照你们的流程，我现在应该还不符合优先处理条件，对吗？",
    distract: "这里的冷气是不是太冷了？我们先换个位置好了。",
    blame: "你们根本没人在乎我有多痛！",
    please: "没关系，你们先忙，我可以再忍一下。",
    congruent: "我现在很害怕，也真的很痛；请告诉我下一步会怎么做。",
  },
  partner: {
    super: "请提供目前的分级、等候时间与处置标准。",
    distract: "要不然我先去买点喝的，等等再说。",
    blame: "如果出了问题，你们谁要负责？",
    please: "对不起，我不该一直问，麻烦你们了。",
    congruent: "我很担心她，也因为不知道状况而着急；请让我知道我能做什么。",
  },
  nurse: {
    super: "目前生命征象稳定，请依分诊规则继续等候。",
    distract: "我们先看看今天宝宝有没有特别活泼，好吗？",
    blame: "你们一直打断，我根本没办法帮忙。",
    please: "真的很抱歉，我马上想办法，不会让你们再等。",
    congruent: "我看见你们很着急；我会先确认安全，也会说清楚目前能做的事。",
  },
};

const scenarios: Record<ScenarioKey, Scenario> = {
  maternity: {
    key: "maternity", eventCode: "CARE2026", number: "01", switchLabel: "情境 01 · 焦虑孕妇与急躁伴侣",
    image: "/scenario-maternity.png", qr: "/qr-live.png", imageAlt: "焦虑孕妇、伴侣与护士在产房咨询台互动",
    presenterEyebrow: "情境模拟 01 · 产儿科高难度对话", captionLabel: "此刻的产房咨询台",
    captionQuote: "我们已经等很久了，医生到底什么时候来？",
    roles: maternityRoles, behaviors: maternityBehaviors, emotions: maternityEmotions, statements: maternityStatements,
  },
  campus: {
    key: "campus", eventCode: "UNPLANNED2026", number: "02", switchLabel: "情境 02 · 女大学生非预期怀孕",
    image: "/scenario-campus.png", qr: "/qr-campus.png", imageAlt: "女大学生、伴侣与校园护理师在健康中心对话",
    presenterEyebrow: "情境模拟 02 · 校园非预期怀孕支持对话", captionLabel: "此刻的校园健康中心",
    captionQuote: "我不知道该怎么办，也不敢让别人知道。",
    roles: {
      patient: { label: "迷惘的女大学生", short: "女大学生", icon: "学", color: "coral", quote: "我完全没准备好，也不知道该告诉谁。", need: "安全、选择权、被理解、不被评判" },
      partner: { label: "不知所措的伴侣", short: "伴侣", icon: "伴", color: "amber", quote: "我很担心她，却不知道怎样做才是对的。", need: "信息、参与感、方向、关系稳定" },
      nurse: { label: "校园护理师", short: "护理师", icon: "护", color: "blue", quote: "我要先确认她的安全，也要尊重她自己的决定。", need: "安全评估、专业边界、支持网络、知情选择" },
    },
    behaviors: {
      patient: ["反复确认验孕结果是否准确", "低头沉默，紧握手机", "急着询问能不能不让家人知道", "在不同选择之间反复改变想法", "流泪并说自己把一切都搞砸了"],
      partner: ["连续追问接下来应该怎么办", "急着替女学生做出决定", "沉默回避与女学生对视", "反复查看网络上的怀孕信息", "询问自己可以提供哪些支持"],
      nurse: ["先确认身体状况与紧急风险", "说明保密原则与可用资源", "直接列出流程但较少回应情绪", "邀请女学生说出最担心的事", "确认是否存在胁迫或安全疑虑"],
    },
    emotions: ["震惊", "害怕", "羞耻", "无助", "焦虑", "内疚", "孤单", "矛盾", "不确定", "渴望被支持"],
    statements: {
      patient: {
        super: "我想先把所有选项、风险和时间限制都弄清楚，再决定下一步。", distract: "我们先别谈这个了，我等一下还有课，快迟到了。", blame: "都是你害的！为什么现在要我一个人面对？", please: "你们觉得怎么做比较好，我都可以配合。", congruent: "我很害怕也很混乱；我需要知道有哪些选择，并给我一点时间决定。",
      },
      partner: {
        super: "请把检查、法律规定、费用和后续流程一次说明清楚。", distract: "要不我们先去吃点东西，晚一点再处理这件事。", blame: "你为什么没有早点发现？现在事情全乱了！", please: "只要她不要生气，我什么都答应，我都可以。", congruent: "我也很害怕，不知道怎么帮她；我想先听她的需要，再一起了解选择。",
      },
      nurse: {
        super: "依照流程，我们先完成评估，再提供转介与后续安排。", distract: "我们先聊聊最近上课和睡眠的情况，好吗？", blame: "你们怎么没有做好避孕，现在才来着急？", please: "别担心，我会替你把所有事情都安排好。", congruent: "我听见你很害怕；我们会先确认安全，再依你的意愿一起了解每个选择。",
      },
    },
  },
  thoracic: {
    key: "thoracic", eventCode: "THORACIC2026", number: "03", switchLabel: "情境 03 · 胸腔开刀的第二意见",
    image: "/scenario-thoracic.png", qr: "/qr-thoracic.png", imageAlt: "胸腔有肿瘤的爷爷、陪伴的儿子与年轻主治医生讨论第二意见",
    presenterEyebrow: "情境模拟 03 · 胸腔手术第二意见沟通", captionLabel: "此刻的胸腔外科诊间",
    captionQuote: "医生，我想再听听别人的意见，才决定要不要开刀。",
    roles: {
      patient: { label: "胸腔有肿瘤的爷爷", short: "爷爷", icon: "爷", color: "coral", quote: "我不是不相信医生，只是开刀这件事太大了。", need: "安全感、选择权、时间、被尊重" },
      partner: { label: "在一旁陪伴的儿子", short: "儿子", icon: "子", color: "amber", quote: "我怕爸爸错过治疗，也怕替他做错决定。", need: "清楚信息、方向、参与感、减轻内疚" },
      nurse: { label: "年轻的主治医生", short: "主治医生", icon: "医", color: "blue", quote: "我希望他理解风险，也要尊重他寻求第二意见。", need: "信任、专业完整、共同决策、治疗时机" },
    },
    behaviors: {
      patient: ["反复询问不开刀会怎么样", "看着影像沉默很久", "强调自己年纪大不想受苦", "询问能否先听第二位医生意见", "把决定推给身旁的儿子"],
      partner: ["追问手术成功率与恢复时间", "急着劝父亲尽快接受手术", "替父亲回答医生的问题", "拿出手机记录并核对信息", "停下来询问父亲真正担心什么"],
      nurse: ["逐项说明手术效益与风险", "用专业术语快速解释影像", "确认爷爷对信息的理解", "主动提供第二意见与转诊方式", "邀请父子分别说出最在意的事"],
    },
    emotions: ["害怕", "焦虑", "犹豫", "无助", "不信任", "担心后悔", "内疚", "心疼", "希望", "渴望被尊重"],
    statements: {
      patient: {
        super: "请告诉我肿瘤大小、分期、手术成功率和不手术的风险。", distract: "先别说开刀了，最近天气不错，我还想回乡下走走。", blame: "你们只会叫我开刀，根本没有想过我这么大年纪受不受得了！", please: "你们觉得怎么做就怎么做，我不想让孩子为难。", congruent: "我很害怕手术，也担心错过治疗；我想听完第二意见再做决定。",
      },
      partner: {
        super: "请把所有治疗方案、数据、费用和时间表列出来让我们比较。", distract: "爸，我们先去吃饭吧，这些事情回家再慢慢谈。", blame: "爸，你为什么一直拖？错过机会以后怎么办！", please: "只要爸爸安心，怎么决定我都配合，不用考虑我。", congruent: "我怕爸爸错过治疗，也怕逼他做决定；我想先听懂选择，再尊重他的意愿。",
      },
      nurse: {
        super: "依据影像与指南，现阶段建议手术切除并完成病理评估。", distract: "我们先不谈手术，最近食欲和睡眠还好吗？", blame: "如果一直犹豫延误治疗，之后的风险就要自己承担。", please: "您不想开刀也没关系，我都照您的意思安排。", congruent: "我理解您害怕，也尊重您寻求第二意见；我会说明时间与风险，陪您做知情决定。",
      },
    },
  },
  medication: {
    key: "medication", eventCode: "MEDERROR2026", number: "04", switchLabel: "情境 04 · 新手护理师给错药",
    image: "/scenario-medication.png", qr: "/qr-medication.png", imageAlt: "新手护理师、资深护理师与护理长在护理站讨论给错药事件",
    presenterEyebrow: "情境模拟 04 · 给药错误与病人安全通报", captionLabel: "此刻的护理站",
    captionQuote: "我发现给药记录不一致，已经先确认病人状况，我们需要马上回报。",
    roles: {
      patient: { label: "给错药的新手护理师", short: "新手护理师", icon: "新", color: "coral", quote: "我真的不是故意的，我怕大家以后都不信任我。", need: "安全、被倾听、修复机会、清楚指引" },
      partner: { label: "发现错误的资深护理师", short: "资深护理师", icon: "资", color: "amber", quote: "我必须先保护病人，也不想让学妹一个人扛下所有责任。", need: "病人安全、事实完整、团队支持、专业责任" },
      nurse: { label: "接获回报的护理长", short: "护理长", icon: "长", color: "blue", quote: "先稳定病人、厘清事实，再一起找出系统哪里需要改变。", need: "即时处置、透明通报、公平学习、系统改善" },
    },
    behaviors: {
      patient: ["反复确认给药记录与药袋", "声音发抖并不断道歉", "急着解释当时工作量很大", "担心被处分而不敢完整说明", "主动询问病人目前状况与补救方式"],
      partner: ["立即确认病人生命征象与症状", "核对医嘱、药物与给药时间", "暂停新手护理师继续给药", "完整记录发现经过并回报护理长", "陪新手护理师整理事实与时间线"],
      nurse: ["先指示完成病人安全评估", "通知医生并启动异常事件通报", "分别询问两位护理师事件经过", "检视排班、交班与药物流程", "安排后续说明、支持与团队复盘"],
    },
    emotions: ["震惊", "害怕", "自责", "羞愧", "焦虑", "委屈", "生气", "担心被责罚", "心疼病人", "渴望被理解"],
    statements: {
      patient: {
        super: "我会依照异常事件流程完成记录，并逐项说明给药时间与剂量。", distract: "我先去处理其他病人的事情，这件事晚一点再说可以吗？", blame: "今天这么忙又没人帮我，出错怎么能全部怪我！", please: "都是我的错，怎么处分我都可以，请不要怪其他人。", congruent: "我很害怕也很自责；我愿意完整说明，并先一起确认病人安全与补救方式。",
      },
      partner: {
        super: "依据给药安全规范，现在应先评估病人、通知医生并完成事件通报。", distract: "我们先把今天的工作做完，等下班再处理这份记录。", blame: "我已经提醒过很多次，你怎么还会犯这种错误！", please: "没关系，我先帮你把后面的事情处理掉，不用太担心。", congruent: "我很担心病人，也知道你现在害怕；我们先确保安全，再一起把事实说清楚。",
      },
      nurse: {
        super: "请依标准流程完成评估、医师通知、纪录与异常事件系统通报。", distract: "最近大家都很辛苦，我们先不要把事情弄得太严重。", blame: "给药是基本职责，发生这种错误你要怎么负责？", please: "只要病人没事就好，这次我先帮你们处理，不用正式通报。", congruent: "病人安全是第一步；我会公平厘清个人与系统因素，让事件成为改善的依据。",
      },
    },
  },
  wardconflict: {
    key: "wardconflict", eventCode: "WARDCONFLICT2026", number: "05", switchLabel: "情境 05 · 病房技术操作中的情绪失控",
    image: "/scenario-wardconflict.png", qr: "/qr-wardconflict.png", imageAlt: "医师、新手护理师与资深护理师在病房技术操作后处理冲突",
    presenterEyebrow: "情境模拟 05 · 病房冲突与团队安全", captionLabel: "此刻的病房技术操作现场",
    captionQuote: "先暂停一下。现在的沟通已经影响团队与病人安全。",
    roles: {
      patient: { label: "情绪失控的医师", short: "医师", icon: "医", color: "coral", quote: "事情一直不顺，我只想赶快把技术完成。", need: "掌控、效率、被支持、专业胜任感" },
      partner: { label: "被责骂的新手护理师", short: "新手护理师", icon: "新", color: "amber", quote: "我很害怕，不知道现在说什么会不会更糟。", need: "安全、尊重、清楚指令、被保护" },
      nurse: { label: "在场的资深护理师", short: "资深护理师", icon: "资", color: "blue", quote: "我要先稳住现场，也要让不适当的行为停下来。", need: "病人安全、专业界线、团队合作、公平处理" },
    },
    behaviors: {
      patient: ["提高音量责骂护理师", "把非危险用品重放或丢到治疗车", "反复催促器材与步骤", "拒绝听护理师说明现场状况", "短暂停下并重新确认技术需求"],
      partner: ["僵住沉默并避免眼神接触", "慌乱寻找器材导致动作变慢", "不断道歉并答应所有要求", "尝试说明自己没有跟上指令", "主动请求资深护理师协助"],
      nurse: ["明确要求暂停不安全的互动", "先确认病人与器材安全", "用简短语言重新分配任务", "陪新手护理师离开现场稳定情绪", "记录经过并启动后续通报沟通"],
    },
    emotions: ["愤怒", "挫折", "焦虑", "害怕", "羞辱", "委屈", "无助", "紧张", "担心冲突升级", "渴望被尊重"],
    statements: {
      patient: {
        super: "请依照技术步骤准备所有器材，不要再影响操作进度。", distract: "算了，先不做了，换个时间再处理这位病人。", blame: "这么简单的事情都做不好，你到底有没有受过训练！", please: "好，都照你们的方式，我不再说任何意见。", congruent: "我现在很挫折，也担心操作延误；我需要暂停一下，再用清楚且尊重的方式确认分工。",
      },
      partner: {
        super: "目前器材准备进度与操作流程如下，我会依序完成指令。", distract: "我先去拿其他东西，这里请学姊帮忙一下。", blame: "你自己没有说清楚，为什么全部怪我！", please: "对不起，都是我的错，你怎么说我都会照做。", congruent: "我现在很紧张，也没有跟上指令；请清楚告诉我优先步骤，并停止用责骂的方式沟通。",
      },
      nurse: {
        super: "依据团队沟通规范，应立即暂停操作、确认安全并重新分配任务。", distract: "大家都累了，先把事情做完，刚才的情况以后再说。", blame: "你身为医师却这样乱丢东西，根本没有资格责怪别人！", please: "医生您别生气，我来处理全部事情，新人先不要讲话。", congruent: "我看见现场压力很高；我们先确保病人安全，也请停止责骂和丢物，再重新确认分工。",
      },
    },
  },
};

const ScenarioContext = createContext<Scenario>(scenarios.maternity);
const useScenario = () => useContext(ScenarioContext);

function RoleAvatar({ role }: { role: RoleKey }) {
  const { roles } = useScenario();
  return <span className={`role-avatar ${roles[role].color}`}>{roles[role].icon}</span>;
}

function createParticipantId() {
  const bytes = new Uint8Array(16);
  if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

export default function Home() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("maternity");
  const scenario = scenarios[scenarioKey];
  const { roles, behaviors, emotions, statements } = scenario;
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const [view, setView] = useState<ViewKey>("participant");
  const [step, setStep] = useState(1);
  const [presenterScreen, setPresenterScreen] = useState(1);
  const [role, setRole] = useState<RoleKey | null>(null);
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedStance, setSelectedStance] = useState<StanceKey | null>(null);
  const [connectedParticipants, setConnectedParticipants] = useState<number | null>(null);
  const [surveySession, setSurveySession] = useState<SurveySession | null>(null);
  const [liveResponses, setLiveResponses] = useState<LiveResponse[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  useDocumentLocalization(locale);

  useEffect(() => {
    const saved = window.localStorage.getItem("lpl-locale") as Locale | null;
    if (saved && saved in localeLabels) setLocale(saved);
    const requested = new URLSearchParams(window.location.search).get("scenario");
    if (requested === "campus" || requested === "thoracic" || requested === "medication" || requested === "wardconflict") setScenarioKey(requested);
  }, []);

  const changeScenario = (next: ScenarioKey) => {
    setScenarioKey(next);
    setStep(1); setPresenterScreen(1); setRole(null); setSelectedBehaviors([]); setSelectedEmotions([]); setSelectedStance(null);
    setConnectedParticipants(null); setSurveySession(null); setLiveResponses([]);
    const url = new URL(window.location.href);
    next === "maternity" ? url.searchParams.delete("scenario") : url.searchParams.set("scenario", next);
    window.history.replaceState({}, "", url);
  };

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    window.localStorage.setItem("lpl-locale", nextLocale);
  };

  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await fetch(`/api/interaction?eventCode=${scenario.eventCode}`, { cache: "no-store" });
        const data = await response.json();
        if (response.ok && typeof data.participants === "number") setConnectedParticipants(data.participants);
        if (response.ok && data.session) setSurveySession(data.session);
        if (response.ok && Array.isArray(data.responses)) setLiveResponses(data.responses);
      } catch { /* 保留现场最后一次成功数字 */ }
    };
    refresh();
    const timer = window.setInterval(refresh, 3000);
    return () => window.clearInterval(timer);
  }, [scenario.eventCode]);

  const submitResponse = async (stage: "role" | "iceberg" | "complete", stance: StanceKey | null = selectedStance, roleOverride: RoleKey | null = role, answerOverride?: { behaviors?: string[]; emotions?: string[] }) => {
    if (!roleOverride) return false;
    let participantId = window.localStorage.getItem("lpl-participant-id");
    if (!participantId) {
      participantId = createParticipantId();
      window.localStorage.setItem("lpl-participant-id", participantId);
    }
    try {
      const response = await fetch("/api/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId,
          eventCode: scenario.eventCode,
          role: roleOverride,
          behaviors: stage === "role" ? [] : answerOverride?.behaviors ?? selectedBehaviors,
          emotions: stage === "role" ? [] : answerOverride?.emotions ?? selectedEmotions,
          stance,
          dialogue: stance ? statements[roleOverride][stance] : null,
          stage,
        }),
      });
      if (!response.ok) throw new Error("资料暂时无法送出，请稍后再试");
      setSubmitError(null);
      const latest = await fetch(`/api/interaction?eventCode=${scenario.eventCode}`, { cache: "no-store" });
      const data = await latest.json();
      if (latest.ok) {
        setConnectedParticipants(data.participants ?? 0);
        setLiveResponses(Array.isArray(data.responses) ? data.responses : []);
      }
      return true;
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "资料暂时无法送出，请稍后再试");
      return false;
    }
  };

  useEffect(() => {
    if (step !== 2 || !role || (!selectedBehaviors.length && !selectedEmotions.length)) return;
    const timer = window.setTimeout(() => {
      void submitResponse("iceberg", null, role, { behaviors: selectedBehaviors, emotions: selectedEmotions });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [step, role, selectedBehaviors, selectedEmotions]);

  const controlSurvey = async (action: "start" | "close") => {
    const message = translate(locale, action === "start"
      ? "确定重新开始？目前场次会封存，并建立一个人数归零的新场次。"
      : "确定结束本次调查？结束后将停止接受新填答。");
    if (!window.confirm(message)) return;
    const pin = window.prompt(translate(locale, "请输入主办人管理密码"));
    if (!pin) return;
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, pin, eventCode: scenario.eventCode }),
    });
    const data = await response.json();
    if (!response.ok) return window.alert(data.error || "操作失败");
    setSurveySession(data.session ?? null);
    setConnectedParticipants(0);
    setLiveResponses([]);
    window.alert(translate(locale, action === "start" ? "新场次已经开始，画面统计已归零。" : "调查已经结束，资料已完整封存。"));
  };

  const liveStats = useMemo(() => {
    const roleCounts = { patient: 0, partner: 0, nurse: 0 } as Record<RoleKey, number>;
    const icebergCompleted = { patient: 0, partner: 0, nurse: 0 } as Record<RoleKey, number>;
    const behaviorCompleted = { patient: 0, partner: 0, nurse: 0 } as Record<RoleKey, number>;
    const emotionCompleted = { patient: 0, partner: 0, nurse: 0 } as Record<RoleKey, number>;
    const behaviorCounts = { patient: behaviors.patient.map(() => 0), partner: behaviors.partner.map(() => 0), nurse: behaviors.nurse.map(() => 0) } as Record<RoleKey, number[]>;
    const emotionCounts = { patient: emotions.map(() => 0), partner: emotions.map(() => 0), nurse: emotions.map(() => 0) } as Record<RoleKey, number[]>;
    const stanceCounts = { patient: { super: 0, distract: 0, blame: 0, please: 0, congruent: 0 }, partner: { super: 0, distract: 0, blame: 0, please: 0, congruent: 0 }, nurse: { super: 0, distract: 0, blame: 0, please: 0, congruent: 0 } } as Record<RoleKey, Record<StanceKey, number>>;
    for (const response of liveResponses) {
      if (!roles[response.role]) continue;
      roleCounts[response.role]++;
      if (response.stage !== "role" && (response.behaviors?.length || response.emotions?.length)) icebergCompleted[response.role]++;
      if (response.behaviors?.length) behaviorCompleted[response.role]++;
      if (response.emotions?.length) emotionCompleted[response.role]++;
      response.behaviors?.forEach((item) => { const index = behaviors[response.role].indexOf(item); if (index >= 0) behaviorCounts[response.role][index]++; });
      response.emotions?.forEach((item) => { const index = emotions.indexOf(item); if (index >= 0) emotionCounts[response.role][index]++; });
      if (response.stance && stanceCounts[response.role][response.stance] !== undefined) stanceCounts[response.role][response.stance]++;
    }
    return { roleCounts, icebergCompleted, behaviorCompleted, emotionCompleted, behaviorCounts, emotionCounts, stanceCounts };
  }, [liveResponses, scenarioKey]);
  const roleTotal = Math.max(1, Object.values(liveStats.roleCounts).reduce((a, b) => a + b, 0));
  const progress = `${Math.min(step, 5) * 20}%`;

  const chooseRole = (nextRole: RoleKey) => {
    if (nextRole === role) {
      setStep(2);
      return;
    }
    setRole(nextRole);
    setSelectedBehaviors([]);
    setSelectedEmotions([]);
    setSelectedStance(null);
    setStep(2);
    void submitResponse("role", null, nextRole);
  };

  const toggleBehavior = (item: string) => setSelectedBehaviors((current) => current.includes(item) ? current.filter((x) => x !== item) : current.length < 3 ? [...current, item] : current);
  const toggleEmotion = (item: string) => setSelectedEmotions((current) => current.includes(item) ? current.filter((x) => x !== item) : [...current, item]);
  const chooseStance = (nextStance: StanceKey) => {
    setSelectedStance(nextStance);
    void submitResponse("complete", nextStance);
  };

  return (
    <ScenarioContext.Provider value={scenario}><main className="site-shell">
      <div className="conference-banner">整合设计思考、萨提尔模式与生成式 AI 于医疗临床沟通教学之设计与实践</div>
      <header className="topbar">
        <div className="brand-lockup"><span className="brand-mark">觉</span><div><strong>共感现场</strong><span>LIVE PERSPECTIVE LAB</span></div></div>
        <div className="view-switch" aria-label="预览画面切换">
          <button className={view === "presenter" ? "active" : ""} onClick={() => setView("presenter")}>讲者画面</button>
          <button className={view === "participant" ? "active" : ""} onClick={() => setView("participant")}>手机参与</button>
        </div>
        <div className="language-switch" aria-label="Language">
          {(Object.keys(localeLabels) as Locale[]).map((key) => <button key={key} className={locale === key ? "active" : ""} onClick={() => changeLocale(key)}>{localeLabels[key]}</button>)}
        </div>
        <div className="live-pill"><i /> LIVE · 情境 {scenario.number}</div>
      </header>
      <nav className="scenario-switch" aria-label="情境切换">
        {(Object.keys(scenarios) as ScenarioKey[]).map((key) => <button key={key} className={scenarioKey === key ? "active" : ""} onClick={() => changeScenario(key)}>{scenarios[key].switchLabel}</button>)}
      </nav>

      {view === "presenter" ? (
        <PresenterView screen={presenterScreen} setScreen={setPresenterScreen} roleTotal={roleTotal} connectedParticipants={connectedParticipants} surveySession={surveySession} onSurveyControl={controlSurvey} stats={liveStats} />
      ) : (
        <section className="experience-layout">
          <div className="experience-copy">
            <span className="step-kicker">INTERACTIVE JOURNEY</span>
            <h1>{step === 1 ? "先站进一个人的位置" : step === 2 ? "看见行为底下的冰山" : step === 3 ? "把个人觉察放回现场" : step === 4 ? "听见他真正想说的话" : "遇见和你看见相同的人"}</h1>
            <p>{step === 1 ? "同一个场景，三种截然不同的真实。选择一个角色，从他的视角开始。" : step === 2 ? "行为只是水面上的一小部分。复选你看见的行为，也选出你猜测的内在情绪。" : step === 3 ? "比较三个角色的行为与内在情绪，看看全场如何理解这个情境。" : step === 4 ? "同一句需要，可能穿上五种不同的语气。选出他最可能说出口的那一句。" : "只比较选择同一角色的参与者，看看彼此在行为、情绪与应对姿态上的共鸣与差异。"}</p>
            <div className="journey-map">
              {["选择角色", "行为 × 冰山", "全场统计", "应对姿态", "同角色统计"].map((label, index) => <button key={label} className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""} onClick={() => index + 1 <= step && setStep(index + 1)}><b>{step > index + 1 ? "✓" : index + 1}</b><span>{label}</span></button>)}
            </div>
            <button className="presenter-link" onClick={() => { setView("presenter"); setPresenterScreen(Math.min(step, 3)); }}>在讲者画面查看这一阶段 →</button>
          </div>

          <div className="phone-shell detail-phone">
            <div className="phone-status"><span>9:41</span><span>● ● ●</span></div>
            <div className="mobile-brand"><span className="brand-mark small">觉</span><span><b>共感现场</b><small>情境模拟 {scenario.number}</small></span><i /></div>
            <div className="mobile-progress"><span style={{ width: progress }} /></div>
            {step === 1 && <RoleStep onChoose={chooseRole} />}
            {step === 2 && role && <IcebergStep role={role} selectedBehaviors={selectedBehaviors} selectedEmotions={selectedEmotions} onBehavior={toggleBehavior} onEmotion={toggleEmotion} onNext={() => { void submitResponse("iceberg", null); setStep(3); }} />}
            {step === 3 && <MobileResults onNext={() => setStep(4)} stats={liveStats} />}
            {step === 4 && role && <StanceStep role={role} selected={selectedStance} onSelect={chooseStance} onNext={() => setStep(5)} />}
            {step === 5 && role && <PeerResults role={role} selectedBehaviors={selectedBehaviors} selectedEmotions={selectedEmotions} selectedStance={selectedStance} stats={liveStats} />}
            {submitError && <div className="submit-error" role="alert">{submitError}</div>}
            {step > 1 && <button className="phone-back" onClick={() => setStep(step - 1)}>← 上一步</button>}
          </div>
        </section>
      )}
      <footer className="site-footer">成功大学不分系 李孟学</footer>
    </main></ScenarioContext.Provider>
  );
}

function RoleStep({ onChoose }: { onChoose: (role: RoleKey) => void }) {
  const { roles, image, imageAlt } = useScenario();
  return <div className="mobile-content role-step">
    <span className="eyebrow">STEP 01 · 视角选择</span><h2>你想先觉察谁？</h2><p>选择一个角色，接下来的问题会从他的视角展开。</p>
    <div className="role-focus-image"><img src={image} alt={imageAlt} /></div>
    <div className="role-choices">{(Object.keys(roles) as RoleKey[]).map((key) => <button className={`choice-card ${roles[key].color}`} key={key} onClick={() => onChoose(key)}><RoleAvatar role={key} /><span><strong>{roles[key].label}</strong><small>{roles[key].quote}</small></span><b>→</b></button>)}</div>
  </div>;
}

function IcebergStep({ role, selectedBehaviors, selectedEmotions, onBehavior, onEmotion, onNext }: { role: RoleKey; selectedBehaviors: string[]; selectedEmotions: string[]; onBehavior: (s: string) => void; onEmotion: (s: string) => void; onNext: () => void }) {
  const { roles, behaviors, emotions, image } = useScenario();
  const meta = roles[role];
  return <div className="mobile-content iceberg-step">
    <div className={`portrait-focus ${role}`}><img src={image} alt={`${meta.label}人物特写`} /><div><RoleAvatar role={role} /><span><small>你正在觉察</small><strong>{meta.label}</strong></span></div></div>
    <div className="inner-voice"><span>他的内在声音</span><strong>「{meta.quote}」</strong><small>深层需要：{meta.need}</small></div>
    <div className="question-block"><div className="question-head"><span>水面之上 · 行为</span><small>五项中最多选 3 项</small></div><div className="check-list">{behaviors[role].map((item) => <button key={item} className={selectedBehaviors.includes(item) ? "selected" : ""} onClick={() => onBehavior(item)}><i>{selectedBehaviors.includes(item) ? "✓" : ""}</i>{item}</button>)}</div></div>
    <div className="iceberg-divider"><span>ICEBERG</span></div>
    <div className="question-block"><div className="question-head"><span>水面之下 · 内在情绪</span><small>可复选</small></div><div className="emotion-cloud">{emotions.map((item) => <button key={item} className={selectedEmotions.includes(item) ? "selected" : ""} onClick={() => onEmotion(item)}>{item}</button>)}</div></div>
    <button className="primary-action" disabled={!selectedBehaviors.length || !selectedEmotions.length} onClick={onNext}>送出觉察，查看全场 →</button>
  </div>;
}

function MobileResults({ onNext, stats }: { onNext: () => void; stats: LiveStats }) {
  const { roles, behaviors, emotions } = useScenario();
  return <div className="mobile-content mobile-results"><span className="eyebrow">STEP 03 · 全场映照</span><h2>大家看见了什么？</h2><p>选择没有对错。差异本身，就是理解彼此的入口。</p>
    {(Object.keys(roles) as RoleKey[]).map((role) => { const top = Math.max(...stats.behaviorCounts[role]); const topIndex = Math.max(0, stats.behaviorCounts[role].indexOf(top)); return <div className={`mini-stat-card ${roles[role].color}`} key={role}><div><RoleAvatar role={role} /><span><strong>{roles[role].label}</strong><small>{stats.roleCounts[role]} 人选择</small></span></div><b>{top ? behaviors[role][topIndex] : "等待现场回应"}</b><div className="mini-emotions">{emotions.slice(0, 3).map((emotion, i) => <span key={emotion}>{emotion} {stats.emotionCounts[role][i]}</span>)}</div></div>; })}
    <button className="primary-action" onClick={onNext}>下一步：他想说什么？ →</button>
  </div>;
}

function StanceStep({ role, selected, onSelect, onNext }: { role: RoleKey; selected: StanceKey | null; onSelect: (s: StanceKey) => void; onNext: () => void }) {
  const { roles, statements, image } = useScenario();
  return <div className="mobile-content stance-step"><div className={`portrait-focus compact ${role}`}><img src={image} alt={`${roles[role].label}人物特写`} /><div><RoleAvatar role={role} /><span><small>站在他的视角</small><strong>{roles[role].label}</strong></span></div></div><span className="eyebrow">STEP 04 · 萨提尔应对姿态</span><h2>此刻，他最想说哪一句？</h2><p>五句话分别对应一种应对姿态。先凭直觉选，再看看语言背后的保护方式。</p><div className="statement-list">{(Object.keys(stances) as StanceKey[]).map((key) => <button key={key} className={selected === key ? "selected" : ""} onClick={() => onSelect(key)}><i style={{ background: stances[key].color }}>{selected === key ? "✓" : ""}</i><span><strong>「{statements[role][key]}」</strong>{selected === key && <small><b>{stances[key].label}</b> · {stances[key].note}</small>}</span></button>)}</div>{selected && <><div className="submitted">✓ 已送出：{stances[selected].label}。讲者画面已更新全场统计。</div><button className="primary-action" onClick={onNext}>下一步：看看和我一样的人 →</button></>}</div>;
}

function PeerResults({ role, selectedBehaviors, selectedEmotions, selectedStance, stats }: { role: RoleKey; selectedBehaviors: string[]; selectedEmotions: string[]; selectedStance: StanceKey | null; stats: LiveStats }) {
  const { roles, behaviors, emotions, image } = useScenario();
  const total = Object.values(stats.stanceCounts[role]).reduce((a, b) => a + b, 0);
  const behaviorMax = Math.max(1, ...stats.behaviorCounts[role]);
  return <div className="mobile-content peer-results"><div className={`portrait-focus compact ${role}`}><img src={image} alt={`${roles[role].label}人物特写`} /><div><RoleAvatar role={role} /><span><small>同角色参与者</small><strong>{roles[role].label} · {stats.roleCounts[role]} 人</strong></span></div></div><span className="eyebrow">STEP 05 · 同角色共鸣</span><h2>和你站在同一位置的人，看见了什么？</h2><p>以下只统计同样选择「{roles[role].label}」的参与者。</p><section className="peer-section"><header><span>行为选择</span><small>你的选择以 ✓ 标记</small></header>{behaviors[role].map((item, i) => <div className="peer-bar" key={item}><div><span>{selectedBehaviors.includes(item) ? "✓ " : ""}{item}</span><b>{stats.behaviorCounts[role][i]}</b></div><i><b style={{ width: `${stats.behaviorCounts[role][i] / behaviorMax * 100}%` }} /></i></div>)}</section><section className="peer-section"><header><span>内在情绪</span><small>可看见相似与差异</small></header><div className="peer-emotion-grid">{emotions.map((item, i) => <div className={selectedEmotions.includes(item) ? "mine" : ""} key={item}><span>{selectedEmotions.includes(item) ? "✓ " : ""}{item}</span><b>{stats.emotionCounts[role][i]}</b></div>)}</div></section><section className="peer-section"><header><span>应对姿态</span><small>共 {total} 份回应</small></header><div className="peer-stance-list">{(Object.keys(stances) as StanceKey[]).map((key) => <div className={selectedStance === key ? "mine" : ""} key={key}><i style={{ background: stances[key].color }} /><span>{selectedStance === key ? "✓ " : ""}{stances[key].label}</span><b>{stats.stanceCounts[role][key]}</b></div>)}</div></section><div className="reflection-card"><strong>带走一个觉察</strong><p>相同的角色，不一定产生相同的感受与反应。理解差异，是一致性沟通的开始。</p></div></div>;
}

function IcebergDashboard({ stats }: { stats: LiveStats }) {
  const { roles, behaviors, emotions } = useScenario();
  return <div className="iceberg-dashboard"><div className="dashboard-intro"><span className="step-badge">STEP 02–03</span><h2>三个角色，三座不同的冰山</h2><p>完整呈现五种行为，并将内在情绪依现场选择次数排序，显示前五名。</p></div><div className="role-stat-grid">{(Object.keys(roles) as RoleKey[]).map((role) => {
    const denominator = Math.max(1, stats.icebergCompleted[role]);
    const rankedEmotions = emotions.map((label, index) => ({ label, count: stats.emotionCounts[role][index] })).sort((a, b) => b.count - a.count || emotions.indexOf(a.label) - emotions.indexOf(b.label)).slice(0, 5);
    return <article className={`role-stat-column ${roles[role].color}`} key={role}><header><RoleAvatar role={role} /><div><h3>{roles[role].label}</h3><span>{stats.roleCounts[role]} 人选择角色 · {stats.icebergCompleted[role]} 人开始填写冰山</span></div></header><div className="iceberg-stat-section"><b>水面之上 · 五种行为 <small>{stats.behaviorCompleted[role]}/{stats.roleCounts[role]} 人已填</small></b><div className="emotion-bars behavior-bars">{behaviors[role].map((behavior, index) => <div key={behavior}><span title={behavior}>{behavior}</span><i><b style={{ width: `${stats.behaviorCounts[role][index] / denominator * 100}%` }} /></i><strong>{stats.behaviorCounts[role][index]}</strong></div>)}</div></div><div className="iceberg-stat-section below"><b>水面之下 · 情绪前五名 <small>{stats.emotionCompleted[role]}/{stats.roleCounts[role]} 人已填</small></b><div className="emotion-bars">{rankedEmotions.map((emotion) => <div key={emotion.label}><span>{emotion.label}</span><i><b style={{ width: `${emotion.count / denominator * 100}%` }} /></i><strong>{emotion.count}</strong></div>)}</div></div></article>;
  })}</div></div>;
}

function StanceDashboard({ stats }: { stats: LiveStats }) {
  const { roles, statements } = useScenario();
  return <div className="stance-dashboard"><div className="dashboard-intro"><span className="step-badge">STEP 04</span><h2>一句话，藏着一种保护自己的姿态</h2><p>点选一句话后立即计入；每个色块代表一种萨提尔应对姿态。</p></div><div className="stance-legend">{(Object.keys(stances) as StanceKey[]).map((key) => <span key={key}><i style={{ background: stances[key].color }} />{stances[key].label}</span>)}</div><div className="stance-rows">{(Object.keys(roles) as RoleKey[]).map((role) => {
    const total = Object.values(stats.stanceCounts[role]).reduce((a, b) => a + b, 0);
    const denominator = Math.max(1, total);
    return <article key={role}><header><RoleAvatar role={role} /><div><h3>{roles[role].label}</h3><span>{stats.roleCounts[role]} 人选择角色 · {total} 人完成姿态 · {Math.max(0, stats.roleCounts[role] - total)} 人未完成</span></div></header><div className="stacked-bar">{(Object.keys(stances) as StanceKey[]).map((key) => <i key={key} style={{ width: `${stats.stanceCounts[role][key] / denominator * 100}%`, background: stances[key].color }} title={`${stances[key].label} ${stats.stanceCounts[role][key]} 人`} />)}</div><div className="stance-numbers">{(Object.keys(stances) as StanceKey[]).map((key) => <div key={key} style={{ alignItems: "flex-start", flexDirection: "column", gap: 5, borderTop: `3px solid ${stances[key].color}` }}><span style={{ width: "100%", display: "flex", justifyContent: "space-between", color: stances[key].color, fontWeight: 800 }}>{stances[key].label}<b style={{ color: "var(--ink)" }}>{stats.stanceCounts[role][key]}</b></span><small style={{ color: "var(--ink)", fontSize: 8, lineHeight: 1.55 }}>「{statements[role][key]}」</small></div>)}</div></article>;
  })}</div></div>;
}

function PresenterView({ screen, setScreen, roleTotal, connectedParticipants, surveySession, onSurveyControl, stats }: { screen: number; setScreen: (n: number) => void; roleTotal: number; connectedParticipants: number | null; surveySession: SurveySession | null; onSurveyControl: (action: "start" | "close") => void; stats: LiveStats }) {
  const scenario = useScenario();
  const { roles } = scenario;
  return <section className="presenter-grid expanded-presenter"><div className="stage-column">
    <div className="presenter-nav"><div><span className="eyebrow">{scenario.presenterEyebrow}</span><h1>{screen === 1 ? "现场正在站进谁的视角？" : screen === 2 ? "行为之下，藏着什么感受？" : "我们会用哪种姿态保护自己？"}</h1></div><div className="screen-tabs">{["角色选择", "冰山统计", "应对姿态"].map((label, i) => <button className={screen === i + 1 ? "active" : ""} key={label} onClick={() => setScreen(i + 1)}>{i + 1}. {label}</button>)}</div></div>
    {screen === 1 && <><article className="scenario-card"><div className="scenario-image"><img src={scenario.image} alt={scenario.imageAlt} /><div className="image-caption"><span>{scenario.captionLabel}</span><strong>「{scenario.captionQuote}」</strong></div></div><div className="scenario-copy"><span className="step-badge">STEP 01</span><h2>如果你在现场，<br />你想先站进谁的视角？</h2><p>选择一个角色，带着他的信息、情绪与限制重新看一次现场。</p></div></article><div className="role-results roomy">{(Object.keys(roles) as RoleKey[]).map((role) => { const pct = Math.round(stats.roleCounts[role] / roleTotal * 100); return <div className={`result-card ${roles[role].color}`} key={role}><RoleAvatar role={role} /><div className="result-body"><div className="result-top"><strong>{roles[role].label}</strong><b>{stats.roleCounts[role]} 人</b></div><div className="meter"><span style={{ width: `${pct}%` }} /></div><small>{pct}% 的现场参与者</small></div></div>; })}</div></>}
    {screen === 2 && <IcebergDashboard stats={stats} />}
    {screen === 3 && <StanceDashboard stats={stats} />}
  </div><QrPanel screen={screen} connectedParticipants={connectedParticipants} surveySession={surveySession} onSurveyControl={onSurveyControl} /></section>;
}

function QrPanel({ screen, connectedParticipants, surveySession, onSurveyControl }: { screen: number; connectedParticipants: number | null; surveySession: SurveySession | null; onSurveyControl: (action: "start" | "close") => void }) {
  const { qr } = useScenario();
  const active = surveySession?.status !== "closed";
  return <aside className="qr-panel"><span className="eyebrow">AUDIENCE ACCESS</span><h2>扫描 QR Code<br />加入现场互动</h2><div className="qr-wrap"><img className="qr-image" src={qr} alt="扫描后进入共感现场互动网站" /></div><div className="join-code"><span>手机也可直接输入网址</span><strong className="site-address">live-perspective-lab.vercel.app</strong></div><div className="access-note"><i /> 匿名加入，不收集姓名</div><div className={`survey-status ${active ? "active" : "closed"}`}><b>{active ? "● 调查进行中" : "■ 调查已结束"}</b><span>{surveySession ? `第 ${surveySession.sequenceNo} 场` : "正在连接场次"}</span></div><div className="survey-controls"><button onClick={() => onSurveyControl("start")}>↻ 重新开始</button><button className="end" disabled={!active} onClick={() => onSurveyControl("close")}>■ 调查结束</button></div><small className="control-note">重新开始只会归零画面，旧资料仍完整保留</small><div className="sync-card"><span>即时同步 · 阶段 {screen}</span><div><b>{connectedParticipants ?? 0}</b><small>已连接</small></div><div><b>{connectedParticipants ?? 0}</b><small>已作答</small></div></div></aside>;
}
