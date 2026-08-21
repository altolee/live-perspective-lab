"use client";

import { useLayoutEffect } from "react";

export type Locale = "zh-CN" | "zh-TW" | "en";

export const localeLabels: Record<Locale, string> = {
  "zh-CN": "简体",
  "zh-TW": "繁體",
  en: "EN",
};

const zhTW: Record<string, string> = {
  "海峡两岸现代病原生物学大会暨病原生物学领域数智教育": "海峽兩岸現代病原生物學大會暨病原生物學領域數智教育",
  "共感现场": "共感現場", "觉": "覺", "情境": "情境", "情境模拟 01": "情境模擬 01", "讲者画面": "講者畫面", "手机参与": "手機參與",
  "预览画面切换": "預覽畫面切換", "选择角色": "選擇角色", "角色选择": "角色選擇", "行为 × 冰山": "行為 × 冰山", "全场统计": "全場統計",
  "应对姿态": "應對姿態", "同角色统计": "同角色統計", "在讲者画面查看这一阶段 →": "在講者畫面查看這一階段 →",
  "先站进一个人的位置": "先站進一個人的位置", "看见行为底下的冰山": "看見行為底下的冰山", "把个人觉察放回现场": "把個人覺察放回現場",
  "听见他真正想说的话": "聽見他真正想說的話", "遇见和你看见相同的人": "遇見和你看見相同的人",
  "同一个场景，三种截然不同的真实。选择一个角色，从他的视角开始。": "同一個場景，三種截然不同的真實。選擇一個角色，從他的視角開始。",
  "行为只是水面上的一小部分。复选你看见的行为，也选出你猜测的内在情绪。": "行為只是水面上的一小部分。複選你看見的行為，也選出你猜測的內在情緒。",
  "比较三个角色的行为与内在情绪，看看全场如何理解这个情境。": "比較三個角色的行為與內在情緒，看看全場如何理解這個情境。",
  "同一句需要，可能穿上五种不同的语气。选出他最可能说出口的那一句。": "同一句需要，可能穿上五種不同的語氣。選出他最可能說出口的那一句。",
  "只比较选择同一角色的参与者，看看彼此在行为、情绪与应对姿态上的共鸣与差异。": "只比較選擇同一角色的參與者，看看彼此在行為、情緒與應對姿態上的共鳴與差異。",
  "视角选择": "視角選擇", "你想先觉察谁？": "你想先覺察誰？", "选择一个角色，接下来的问题会从他的视角展开。": "選擇一個角色，接下來的問題會從他的視角展開。",
  "产房咨询台三方互动情境": "產房諮詢台三方互動情境", "焦虑的孕妇": "焦慮的孕婦", "孕妇": "孕婦", "急躁的伴侣": "急躁的伴侶", "伴侣": "伴侶", "一线护士": "一線護理師", "护士": "護理師",
  "孕": "孕", "伴": "伴", "护": "護", "我很痛，也不知道还要等多久。": "我很痛，也不知道還要等多久。", "我不能什么都不做，我必须保护她。": "我不能什麼都不做，我必須保護她。", "我要照顾他们，也不能漏掉任何风险。": "我要照顧他們，也不能漏掉任何風險。",
  "安全、被看见、可预期": "安全、被看見、可預期", "掌控、信息、能够帮上忙": "掌控、資訊、能夠幫上忙", "秩序、专业边界、被信任": "秩序、專業界線、被信任",
  "你正在觉察": "你正在覺察", "他的内在声音": "他的內在聲音", "深层需要：": "深層需要：", "水面之上 · 行为": "水面之上 · 行為", "五项中最多选 3 项": "五項中最多選 3 項", "水面之下 · 内在情绪": "水面之下 · 內在情緒", "可复选": "可複選",
  "送出觉察，查看全场 →": "送出覺察，查看全場 →", "全场映照": "全場映照", "大家看见了什么？": "大家看見了什麼？", "选择没有对错。差异本身，就是理解彼此的入口。": "選擇沒有對錯。差異本身，就是理解彼此的入口。", "等待现场回应": "等待現場回應", "下一步：他想说什么？ →": "下一步：他想說什麼？ →",
  "萨提尔应对姿态": "薩提爾應對姿態", "站在他的视角": "站在他的視角", "此刻，他最想说哪一句？": "此刻，他最想說哪一句？", "五句话分别对应一种应对姿态。先凭直觉选，再看看语言背后的保护方式。": "五句話分別對應一種應對姿態。先憑直覺選，再看看語言背後的保護方式。", "下一步：看看和我一样的人 →": "下一步：看看和我一樣的人 →",
  "超理智": "超理智", "打岔": "打岔", "指责": "指責", "讨好": "討好", "一致性": "一致性", "只谈规则与道理，与感受保持距离": "只談規則與道理，與感受保持距離", "转移焦点，避开当下的压力": "轉移焦點，避開當下的壓力", "用攻击拿回控制感": "用攻擊拿回控制感", "压下自己的需要以维持关系": "壓下自己的需要以維持關係", "同时照顾自己、他人与情境": "同時照顧自己、他人與情境",
  "同角色共鸣": "同角色共鳴", "同角色参与者": "同角色參與者", "和你站在同一位置的人，看见了什么？": "和你站在同一位置的人，看見了什麼？", "以下只统计同样选择": "以下只統計同樣選擇", "的参与者。": "的參與者。", "行为选择": "行為選擇", "你的选择以 ✓ 标记": "你的選擇以 ✓ 標記", "内在情绪": "內在情緒", "可看见相似与差异": "可看見相似與差異", "带走一个觉察": "帶走一個覺察", "相同的角色，不一定产生相同的感受与反应。理解差异，是一致性沟通的开始。": "相同的角色，不一定產生相同的感受與反應。理解差異，是一致性溝通的開始。",
  "三个角色，三座不同的冰山": "三個角色，三座不同的冰山", "完整呈现五种行为，并将内在情绪依现场选择次数排序，显示前五名。": "完整呈現五種行為，並將內在情緒依現場選擇次數排序，顯示前五名。", "水面之上 · 五种行为": "水面之上 · 五種行為", "水面之下 · 情绪前五名": "水面之下 · 情緒前五名",
  "一句话，藏着一种保护自己的姿态": "一句話，藏著一種保護自己的姿態", "点选一句话后立即计入；每个色块代表一种萨提尔应对姿态。": "點選一句話後立即計入；每個色塊代表一種薩提爾應對姿態。",
  "情境模拟 01 · 产儿科高难度对话": "情境模擬 01 · 產兒科高難度對話", "现场正在站进谁的视角？": "現場正在站進誰的視角？", "行为之下，藏着什么感受？": "行為之下，藏著什麼感受？", "我们会用哪种姿态保护自己？": "我們會用哪種姿態保護自己？", "冰山统计": "冰山統計",
  "此刻的产房咨询台": "此刻的產房諮詢台", "我们已经等很久了，医生到底什么时候来？": "我們已經等很久了，醫師到底什麼時候來？", "如果你在现场，": "如果你在現場，", "你想先站进谁的视角？": "你想先站進誰的視角？", "选择一个角色，带着他的信息、情绪与限制重新看一次现场。": "選擇一個角色，帶著他的資訊、情緒與限制重新看一次現場。", "焦虑孕妇、伴侣与护士在产房咨询台互动": "焦慮孕婦、伴侶與護理師在產房諮詢台互動",
  "扫描 QR Code": "掃描 QR Code", "加入现场互动": "加入現場互動", "扫描后进入共感现场互动网站": "掃描後進入共感現場互動網站", "手机也可直接输入网址": "手機也可直接輸入網址", "匿名加入，不收集姓名": "匿名加入，不收集姓名", "调查进行中": "調查進行中", "调查已结束": "調查已結束", "正在连接场次": "正在連接場次", "重新开始": "重新開始", "调查结束": "調查結束", "重新开始只会归零画面，旧资料仍完整保留": "重新開始只會歸零畫面，舊資料仍完整保留", "即时同步 · 阶段": "即時同步 · 階段", "已连接": "已連接", "已作答": "已作答", "上一页": "上一頁", "上一步": "上一步",
  "整合设计思考、萨提尔模式与生成式AI于护理临床沟通教学之设计与实践": "整合設計思考、薩提爾模式與生成式 AI 於護理臨床溝通教學之設計與實踐",
  "人": "人", "人选择": "人選擇", "人选择角色 ·": "人選擇角色 ·", "人开始填写冰山": "人開始填寫冰山", "人完成姿态 ·": "人完成姿態 ·", "人未完成": "人未完成", "人已填": "人已填", "的现场参与者": "的現場參與者", "份回应": "份回應", "共": "共",
  "焦虑": "焦慮", "害怕": "害怕", "无助": "無助", "愤怒": "憤怒", "委屈": "委屈", "不确定": "不確定", "孤单": "孤單", "挫折": "挫折", "内疚": "內疚", "渴望被理解": "渴望被理解",
  "反复询问医生何时来": "反覆詢問醫師何時來", "紧抓腹部、呼吸急促": "緊抓腹部、呼吸急促", "语速变快并提高音量": "語速變快並提高音量", "不断确认宝宝是否安全": "不斷確認寶寶是否安全", "沉默流泪、拒绝回应": "沉默流淚、拒絕回應", "催促柜台立即处理": "催促櫃台立即處理", "打断护士的说明": "打斷護理師的說明", "在走廊来回踱步": "在走廊來回踱步", "拿手机查询并质疑流程": "拿手機查詢並質疑流程", "转身安抚孕妇": "轉身安撫孕婦", "快速重复医疗流程": "快速重複醫療流程", "先确认疼痛与危险征象": "先確認疼痛與危險徵象", "保持距离并简短回答": "保持距離並簡短回答", "邀请伴侣一起整理信息": "邀請伴侶一起整理資訊", "暂停对话寻求同事支持": "暫停對話尋求同事支持",
  "资料暂时无法送出，请稍后再试": "資料暫時無法送出，請稍後再試", "操作失败": "操作失敗", "管理密码不正确": "管理密碼不正確",
  "确定重新开始？目前场次会封存，并建立一个人数归零的新场次。": "確定重新開始？目前場次會封存，並建立一個人數歸零的新場次。", "确定结束本次调查？结束后将停止接受新填答。": "確定結束本次調查？結束後將停止接受新填答。", "请输入主办人管理密码": "請輸入主辦人管理密碼", "新场次已经开始，画面统计已归零。": "新場次已經開始，畫面統計已歸零。", "调查已经结束，资料已完整封存。": "調查已經結束，資料已完整封存。",
  "依照你们的流程，我现在应该还不符合优先处理条件，对吗？": "依照你們的流程，我現在應該還不符合優先處理條件，對嗎？", "这里的冷气是不是太冷了？我们先换个位置好了。": "這裡的冷氣是不是太冷了？我們先換個位置好了。", "你们根本没人在乎我有多痛！": "你們根本沒人在乎我有多痛！", "没关系，你们先忙，我可以再忍一下。": "沒關係，你們先忙，我可以再忍一下。", "我现在很害怕，也真的很痛；请告诉我下一步会怎么做。": "我現在很害怕，也真的很痛；請告訴我下一步會怎麼做。",
  "请提供目前的分级、等候时间与处置标准。": "請提供目前的分級、等候時間與處置標準。", "要不然我先去买点喝的，等等再说。": "要不然我先去買點喝的，等等再說。", "如果出了问题，你们谁要负责？": "如果出了問題，你們誰要負責？", "对不起，我不该一直问，麻烦你们了。": "對不起，我不該一直問，麻煩你們了。", "我很担心她，也因为不知道状况而着急；请让我知道我能做什么。": "我很擔心她，也因為不知道狀況而著急；請讓我知道我能做什麼。",
  "目前生命征象稳定，请依分诊规则继续等候。": "目前生命徵象穩定，請依檢傷規則繼續等候。", "我们先看看今天宝宝有没有特别活泼，好吗？": "我們先看看今天寶寶有沒有特別活潑，好嗎？", "你们一直打断，我根本没办法帮忙。": "你們一直打斷，我根本沒辦法幫忙。", "真的很抱歉，我马上想办法，不会让你们再等。": "真的很抱歉，我馬上想辦法，不會讓你們再等。", "我看见你们很着急；我会先确认安全，也会说清楚目前能做的事。": "我看見你們很著急；我會先確認安全，也會說清楚目前能做的事。",
};

const en: Record<string, string> = {
  "海峡两岸现代病原生物学大会暨病原生物学领域数智教育": "Cross-Strait Conference on Modern Pathobiology and Digital Intelligence Education",
  "共感现场": "Live Perspective Lab", "觉": "LP", "情境": "Scenario", "情境模拟 01": "Scenario 01", "讲者画面": "Presenter", "手机参与": "Participate", "预览画面切换": "View switcher",
  "选择角色": "Choose a role", "角色选择": "Role selection", "行为 × 冰山": "Behavior × Iceberg", "全场统计": "Live results", "应对姿态": "Coping stances", "同角色统计": "Role results", "在讲者画面查看这一阶段 →": "View this stage on the presenter screen →",
  "先站进一个人的位置": "Step into someone’s perspective", "看见行为底下的冰山": "See the iceberg beneath behavior", "把个人觉察放回现场": "Bring your reflection back to the room", "听见他真正想说的话": "Hear what they truly want to say", "遇见和你看见相同的人": "Meet people who saw what you saw",
  "同一个场景，三种截然不同的真实。选择一个角色，从他的视角开始。": "One scene, three very different realities. Choose a role and begin from that person’s perspective.",
  "行为只是水面上的一小部分。复选你看见的行为，也选出你猜测的内在情绪。": "Behavior is only the tip of the iceberg. Select the behaviors you notice and the emotions you sense underneath.",
  "比较三个角色的行为与内在情绪，看看全场如何理解这个情境。": "Compare the three roles and see how the room understands their behavior and inner emotions.",
  "同一句需要，可能穿上五种不同的语气。选出他最可能说出口的那一句。": "The same need can wear five different voices. Choose what this person is most likely to say.",
  "只比较选择同一角色的参与者，看看彼此在行为、情绪与应对姿态上的共鸣与差异。": "Compare only participants who chose the same role and notice similarities and differences in behavior, emotion, and coping stance.",
  "视角选择": "Perspective", "你想先觉察谁？": "Whose perspective will you explore?", "选择一个角色，接下来的问题会从他的视角展开。": "Choose a role. The following questions will unfold from that person’s point of view.",
  "产房咨询台三方互动情境": "Three-way interaction at a maternity consultation desk", "焦虑的孕妇": "Anxious pregnant patient", "孕妇": "Patient", "急躁的伴侣": "Agitated partner", "伴侣": "Partner", "一线护士": "Frontline nurse", "护士": "Nurse", "孕": "P", "伴": "S", "护": "N",
  "我很痛，也不知道还要等多久。": "I’m in pain, and I don’t know how much longer I’ll have to wait.", "我不能什么都不做，我必须保护她。": "I can’t just do nothing. I have to protect her.", "我要照顾他们，也不能漏掉任何风险。": "I need to care for them without missing any risks.",
  "安全、被看见、可预期": "Safety, recognition, predictability", "掌控、信息、能够帮上忙": "Control, information, being useful", "秩序、专业边界、被信任": "Order, professional boundaries, trust",
  "你正在觉察": "You are exploring", "他的内在声音": "Inner voice", "深层需要：": "Deeper needs: ", "水面之上 · 行为": "Above the surface · Behavior", "五项中最多选 3 项": "Choose up to 3 of 5", "水面之下 · 内在情绪": "Below the surface · Emotions", "可复选": "Select all that apply", "送出觉察，查看全场 →": "Submit and view live results →",
  "全场映照": "Room reflection", "大家看见了什么？": "What did everyone notice?", "选择没有对错。差异本身，就是理解彼此的入口。": "There are no right or wrong choices. Difference is where understanding begins.", "等待现场回应": "Waiting for responses", "下一步：他想说什么？ →": "Next: What do they want to say? →",
  "萨提尔应对姿态": "Satir coping stances", "站在他的视角": "From this perspective", "此刻，他最想说哪一句？": "What do they most want to say?", "五句话分别对应一种应对姿态。先凭直觉选，再看看语言背后的保护方式。": "Each statement reflects a coping stance. Choose intuitively, then explore the protection behind the words.", "下一步：看看和我一样的人 →": "Next: See people like me →",
  "超理智": "Computing", "打岔": "Distracting", "指责": "Blaming", "讨好": "Placating", "一致性": "Congruent", "只谈规则与道理，与感受保持距离": "Focus on rules and logic while distancing from feelings", "转移焦点，避开当下的压力": "Shift focus to avoid immediate pressure", "用攻击拿回控制感": "Use attack to regain a sense of control", "压下自己的需要以维持关系": "Suppress personal needs to preserve the relationship", "同时照顾自己、他人与情境": "Attend to self, others, and context at the same time",
  "同角色共鸣": "Shared-role reflection", "同角色参与者": "Participants with the same role", "和你站在同一位置的人，看见了什么？": "What did people in the same position notice?", "以下只统计同样选择": "These results include only participants who chose ", "的参与者。": ".", "行为选择": "Behavior choices", "你的选择以 ✓ 标记": "Your choices are marked ✓", "内在情绪": "Inner emotions", "可看见相似与差异": "Notice similarities and differences", "带走一个觉察": "A reflection to take with you", "相同的角色，不一定产生相同的感受与反应。理解差异，是一致性沟通的开始。": "The same role does not always produce the same feelings or reactions. Understanding differences is the beginning of congruent communication.",
  "三个角色，三座不同的冰山": "Three roles, three different icebergs", "完整呈现五种行为，并将内在情绪依现场选择次数排序，显示前五名。": "Shows all five behaviors and the five most-selected inner emotions.", "水面之上 · 五种行为": "Above the surface · Five behaviors", "水面之下 · 情绪前五名": "Below the surface · Top five emotions",
  "一句话，藏着一种保护自己的姿态": "One sentence can conceal a protective stance", "点选一句话后立即计入；每个色块代表一种萨提尔应对姿态。": "Each choice is counted immediately; every color represents one Satir coping stance.",
  "情境模拟 01 · 产儿科高难度对话": "Scenario 01 · A challenging maternity-care conversation", "现场正在站进谁的视角？": "Whose perspective is the room entering?", "行为之下，藏着什么感受？": "What feelings lie beneath the behavior?", "我们会用哪种姿态保护自己？": "Which stance do we use to protect ourselves?", "冰山统计": "Iceberg results",
  "此刻的产房咨询台": "At the maternity consultation desk", "我们已经等很久了，医生到底什么时候来？": "We’ve been waiting a long time. When will the doctor come?", "如果你在现场，": "If you were here,", "你想先站进谁的视角？": "whose perspective would you enter first?", "选择一个角色，带着他的信息、情绪与限制重新看一次现场。": "Choose a role and revisit the scene with that person’s information, emotions, and constraints.", "焦虑孕妇、伴侣与护士在产房咨询台互动": "An anxious pregnant patient, partner, and nurse at a maternity consultation desk",
  "扫描 QR Code": "Scan the QR code", "加入现场互动": "Join the live interaction", "扫描后进入共感现场互动网站": "Scan to enter Live Perspective Lab", "手机也可直接输入网址": "Or enter the address on your phone", "匿名加入，不收集姓名": "Anonymous; no names collected", "调查进行中": "Survey active", "调查已结束": "Survey closed", "正在连接场次": "Connecting to session", "重新开始": "Restart", "调查结束": "End survey", "重新开始只会归零画面，旧资料仍完整保留": "Restarting resets the display; previous data remains stored", "即时同步 · 阶段": "Live sync · Stage", "已连接": "Connected", "已作答": "Responded", "上一步": "Back",
  "整合设计思考、萨提尔模式与生成式AI于护理临床沟通教学之设计与实践": "Design and Practice of Integrating Design Thinking, the Satir Model, and Generative AI in Clinical Nursing Communication Education",
  "人": "people", "人选择": "selected", "人选择角色 ·": "chose this role ·", "人开始填写冰山": "started the iceberg", "人完成姿态 ·": "completed stance ·", "人未完成": "incomplete", "人已填": "completed", "的现场参与者": "of participants", "份回应": "responses", "共": "Total",
  "焦虑": "Anxiety", "害怕": "Fear", "无助": "Helplessness", "愤怒": "Anger", "委屈": "Hurt", "不确定": "Uncertainty", "孤单": "Loneliness", "挫折": "Frustration", "内疚": "Guilt", "渴望被理解": "Longing to be understood",
  "反复询问医生何时来": "Repeatedly asks when the doctor will come", "紧抓腹部、呼吸急促": "Clutches abdomen and breathes rapidly", "语速变快并提高音量": "Speaks faster and raises voice", "不断确认宝宝是否安全": "Repeatedly checks whether the baby is safe", "沉默流泪、拒绝回应": "Cries silently and stops responding", "催促柜台立即处理": "Pressures the desk for immediate action", "打断护士的说明": "Interrupts the nurse’s explanation", "在走廊来回踱步": "Paces in the hallway", "拿手机查询并质疑流程": "Checks the phone and questions the process", "转身安抚孕妇": "Turns to comfort the patient", "快速重复医疗流程": "Quickly repeats the clinical process", "先确认疼痛与危险征象": "First checks pain and warning signs", "保持距离并简短回答": "Keeps distance and answers briefly", "邀请伴侣一起整理信息": "Invites the partner to organize information", "暂停对话寻求同事支持": "Pauses to seek a colleague’s support",
  "资料暂时无法送出，请稍后再试": "Your response could not be sent. Please try again.", "操作失败": "Action failed", "管理密码不正确": "Incorrect admin password",
  "确定重新开始？目前场次会封存，并建立一个人数归零的新场次。": "Restart now? The current session will be archived and a new session will begin at zero.", "确定结束本次调查？结束后将停止接受新填答。": "End this survey? New responses will no longer be accepted.", "请输入主办人管理密码": "Enter the organizer password", "新场次已经开始，画面统计已归零。": "A new session has started and the live display has been reset.", "调查已经结束，资料已完整封存。": "The survey has ended and its data has been archived.",
  "依照你们的流程，我现在应该还不符合优先处理条件，对吗？": "According to your process, I still don’t meet the criteria for priority treatment, correct?", "这里的冷气是不是太冷了？我们先换个位置好了。": "Isn’t it too cold here? Maybe we should move somewhere else first.", "你们根本没人在乎我有多痛！": "None of you care how much pain I’m in!", "没关系，你们先忙，我可以再忍一下。": "It’s okay. You can help others first; I can endure it a little longer.", "我现在很害怕，也真的很痛；请告诉我下一步会怎么做。": "I’m frightened and in real pain. Please tell me what will happen next.",
  "请提供目前的分级、等候时间与处置标准。": "Please provide the current triage level, waiting time, and treatment criteria.", "要不然我先去买点喝的，等等再说。": "Maybe I’ll go get something to drink and we can talk later.", "如果出了问题，你们谁要负责？": "If something goes wrong, who will be responsible?", "对不起，我不该一直问，麻烦你们了。": "I’m sorry. I shouldn’t keep asking and troubling you.", "我很担心她，也因为不知道状况而着急；请让我知道我能做什么。": "I’m worried about her and anxious because I don’t know what’s happening. Please tell me what I can do.",
  "目前生命征象稳定，请依分诊规则继续等候。": "Vital signs are currently stable. Please continue waiting according to triage protocol.", "我们先看看今天宝宝有没有特别活泼，好吗？": "Let’s first see whether the baby has been especially active today, okay?", "你们一直打断，我根本没办法帮忙。": "You keep interrupting me, so I can’t help at all.", "真的很抱歉，我马上想办法，不会让你们再等。": "I’m truly sorry. I’ll find a solution immediately so you won’t have to wait.", "我看见你们很着急；我会先确认安全，也会说清楚目前能做的事。": "I can see that you’re anxious. I’ll first confirm safety and clearly explain what we can do now.",
};

Object.assign(zhTW, {
  "情境切换": "情境切換", "情境 01 · 焦虑孕妇与急躁伴侣": "情境 01 · 焦慮孕婦與急躁伴侶", "情境 02 · 女大学生非预期怀孕": "情境 02 · 女大學生非預期懷孕", "情境模拟 02": "情境模擬 02",
  "情境模拟 02 · 校园非预期怀孕支持对话": "情境模擬 02 · 校園非預期懷孕支持對話", "此刻的校园健康中心": "此刻的校園健康中心", "我不知道该怎么办，也不敢让别人知道。": "我不知道該怎麼辦，也不敢讓別人知道。", "女大学生、伴侣与校园护理师在健康中心对话": "女大學生、伴侶與校園護理師在健康中心對話",
  "迷惘的女大学生": "迷惘的女大學生", "女大学生": "女大學生", "不知所措的伴侣": "不知所措的伴侶", "校园护理师": "校園護理師", "护理师": "護理師", "学": "學",
  "我完全没准备好，也不知道该告诉谁。": "我完全沒準備好，也不知道該告訴誰。", "我很担心她，却不知道怎样做才是对的。": "我很擔心她，卻不知道怎樣做才是對的。", "我要先确认她的安全，也要尊重她自己的决定。": "我要先確認她的安全，也要尊重她自己的決定。",
  "安全、选择权、被理解、不被评判": "安全、選擇權、被理解、不被評判", "信息、参与感、方向、关系稳定": "資訊、參與感、方向、關係穩定", "安全评估、专业边界、支持网络、知情选择": "安全評估、專業界線、支持網絡、知情選擇",
  "震惊": "震驚", "羞耻": "羞恥", "矛盾": "矛盾", "渴望被支持": "渴望被支持",
  "反复确认验孕结果是否准确": "反覆確認驗孕結果是否準確", "低头沉默，紧握手机": "低頭沉默，緊握手機", "急着询问能不能不让家人知道": "急著詢問能不能不讓家人知道", "在不同选择之间反复改变想法": "在不同選擇之間反覆改變想法", "流泪并说自己把一切都搞砸了": "流淚並說自己把一切都搞砸了",
  "连续追问接下来应该怎么办": "連續追問接下來應該怎麼辦", "急着替女学生做出决定": "急著替女學生做出決定", "沉默回避与女学生对视": "沉默迴避與女學生對視", "反复查看网络上的怀孕信息": "反覆查看網路上的懷孕資訊", "询问自己可以提供哪些支持": "詢問自己可以提供哪些支持",
  "先确认身体状况与紧急风险": "先確認身體狀況與緊急風險", "说明保密原则与可用资源": "說明保密原則與可用資源", "直接列出流程但较少回应情绪": "直接列出流程但較少回應情緒", "邀请女学生说出最担心的事": "邀請女學生說出最擔心的事", "确认是否存在胁迫或安全疑虑": "確認是否存在脅迫或安全疑慮",
});

Object.assign(en, {
  "情境切换": "Scenario switcher", "情境 01 · 焦虑孕妇与急躁伴侣": "Scenario 01 · Anxious patient and agitated partner", "情境 02 · 女大学生非预期怀孕": "Scenario 02 · Unplanned pregnancy", "情境模拟 02": "Scenario 02",
  "情境模拟 02 · 校园非预期怀孕支持对话": "Scenario 02 · Supporting an unplanned pregnancy", "此刻的校园健康中心": "At the campus health center", "我不知道该怎么办，也不敢让别人知道。": "I don’t know what to do, and I’m afraid to tell anyone.", "女大学生、伴侣与校园护理师在健康中心对话": "A student, her partner, and a campus nurse talking at the health center",
  "迷惘的女大学生": "Uncertain university student", "女大学生": "Student", "不知所措的伴侣": "Overwhelmed partner", "校园护理师": "Campus nurse", "护理师": "Nurse", "学": "S",
  "我完全没准备好，也不知道该告诉谁。": "I wasn’t prepared for this, and I don’t know whom to tell.", "我很担心她，却不知道怎样做才是对的。": "I’m worried about her, but I don’t know what the right thing is.", "我要先确认她的安全，也要尊重她自己的决定。": "I need to check her safety and respect her own decision.",
  "安全、选择权、被理解、不被评判": "Safety, autonomy, understanding, no judgment", "信息、参与感、方向、关系稳定": "Information, involvement, direction, relationship stability", "安全评估、专业边界、支持网络、知情选择": "Safety assessment, professional boundaries, support network, informed choice",
  "震惊": "Shock", "羞耻": "Shame", "矛盾": "Conflict", "渴望被支持": "Longing for support",
  "反复确认验孕结果是否准确": "Repeatedly checks whether the pregnancy result is accurate", "低头沉默，紧握手机": "Looks down silently and grips the phone", "急着询问能不能不让家人知道": "Urgently asks whether family can be kept uninformed", "在不同选择之间反复改变想法": "Keeps changing her mind between options", "流泪并说自己把一切都搞砸了": "Cries and says she has ruined everything",
  "连续追问接下来应该怎么办": "Repeatedly asks what they should do next", "急着替女学生做出决定": "Rushes to decide for the student", "沉默回避与女学生对视": "Stays silent and avoids eye contact", "反复查看网络上的怀孕信息": "Repeatedly searches online for pregnancy information", "询问自己可以提供哪些支持": "Asks what support he can provide",
  "先确认身体状况与紧急风险": "First checks physical condition and urgent risks", "说明保密原则与可用资源": "Explains confidentiality and available resources", "直接列出流程但较少回应情绪": "Lists procedures with little emotional response", "邀请女学生说出最担心的事": "Invites the student to share her greatest concern", "确认是否存在胁迫或安全疑虑": "Checks for coercion or safety concerns",
});

const campusStatements: Array<[string, string, string]> = [
  ["我想先把所有选项、风险和时间限制都弄清楚，再决定下一步。", "我想先把所有選項、風險和時間限制都弄清楚，再決定下一步。", "I want to understand every option, risk, and time limit before deciding."],
  ["我们先别谈这个了，我等一下还有课，快迟到了。", "我們先別談這個了，我等一下還有課，快遲到了。", "Let’s not talk about this now. I have class and I’m almost late."],
  ["都是你害的！为什么现在要我一个人面对？", "都是你害的！為什麼現在要我一個人面對？", "This is all your fault! Why do I have to face it alone?"],
  ["你们觉得怎么做比较好，我都可以配合。", "你們覺得怎麼做比較好，我都可以配合。", "Whatever you think is best, I’ll go along with it."],
  ["我很害怕也很混乱；我需要知道有哪些选择，并给我一点时间决定。", "我很害怕也很混亂；我需要知道有哪些選擇，並給我一點時間決定。", "I’m scared and confused. I need to know my options and have time to decide."],
  ["请把检查、法律规定、费用和后续流程一次说明清楚。", "請把檢查、法律規定、費用和後續流程一次說明清楚。", "Please explain the tests, legal requirements, costs, and follow-up process."],
  ["要不我们先去吃点东西，晚一点再处理这件事。", "要不我們先去吃點東西，晚一點再處理這件事。", "Why don’t we get something to eat and deal with this later?"],
  ["你为什么没有早点发现？现在事情全乱了！", "你為什麼沒有早點發現？現在事情全亂了！", "Why didn’t you notice sooner? Everything is a mess now!"],
  ["只要她不要生气，我什么都答应，我都可以。", "只要她不要生氣，我什麼都答應，我都可以。", "As long as she isn’t angry, I’ll agree to anything."],
  ["我也很害怕，不知道怎么帮她；我想先听她的需要，再一起了解选择。", "我也很害怕，不知道怎麼幫她；我想先聽她的需要，再一起了解選擇。", "I’m scared too and unsure how to help. I want to hear what she needs and explore the options together."],
  ["依照流程，我们先完成评估，再提供转介与后续安排。", "依照流程，我們先完成評估，再提供轉介與後續安排。", "Following the process, we will assess first, then arrange referrals and follow-up."],
  ["我们先聊聊最近上课和睡眠的情况，好吗？", "我們先聊聊最近上課和睡眠的情況，好嗎？", "Could we first talk about your classes and sleep lately?"],
  ["你们怎么没有做好避孕，现在才来着急？", "你們怎麼沒有做好避孕，現在才來著急？", "Why didn’t you use contraception properly and only worry now?"],
  ["别担心，我会替你把所有事情都安排好。", "別擔心，我會替你把所有事情都安排好。", "Don’t worry. I’ll arrange everything for you."],
  ["我听见你很害怕；我们会先确认安全，再依你的意愿一起了解每个选择。", "我聽見你很害怕；我們會先確認安全，再依你的意願一起了解每個選擇。", "I hear that you’re scared. We’ll check your safety first, then explore each option according to your wishes."],
];
campusStatements.forEach(([source, traditional, english]) => { zhTW[source] = traditional; en[source] = english; });

const dictionaries: Record<Exclude<Locale, "zh-CN">, Record<string, string>> = { "zh-TW": zhTW, en };

export function translate(locale: Locale, source: string) {
  if (locale === "zh-CN" || !source) return source;
  const dictionary = dictionaries[locale];
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  const core = source.trim();
  if (dictionary[core]) return leading + dictionary[core] + trailing;
  let result = core;
  for (const key of Object.keys(dictionary).sort((a, b) => b.length - a.length)) result = result.split(key).join(dictionary[key]);
  if (locale === "zh-TW") {
    result = result.replace(/(\d+) 人/g, "$1 人").replace(/第 (\d+) 场/g, "第 $1 場").replace(/人已填/g, "人已填").replace(/人未完成/g, "人未完成").replace(/人完成/g, "人完成").replace(/人选择/g, "人選擇");
  } else {
    result = result.replace(/第 (\d+) 场/g, "Session $1").replace(/(\d+) 人选择角色/g, "$1 chose this role").replace(/(\d+) 人开始填写冰山/g, "$1 started the iceberg").replace(/(\d+) 人完成姿态/g, "$1 completed stance").replace(/(\d+) 人未完成/g, "$1 incomplete").replace(/(\d+) 人已填/g, "$1 completed").replace(/(\d+) 人选择/g, "$1 selected").replace(/(\d+) 人/g, "$1 people").replace(/共 (\d+) 份回应/g, "$1 responses").replace(/(\d+)% 的现场参与者/g, "$1% of participants").replace(/已送出：/g, "Submitted: ").replace(/。讲者画面已更新全场统计。/g, ". Presenter results updated.");
  }
  return leading + result + trailing;
}

const textSources = new WeakMap<Text, string>();
const attributeSources = new WeakMap<Element, Map<string, string>>();

function localizeNode(root: Node, locale: Locale) {
  const visit = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node as Text;
      if (!textSources.has(text)) textSources.set(text, text.nodeValue ?? "");
      text.nodeValue = translate(locale, textSources.get(text) ?? "");
      return;
    }
    if (!(node instanceof Element)) return;
    const attrs = ["aria-label", "alt", "title", "placeholder"];
    let originals = attributeSources.get(node);
    if (!originals) { originals = new Map(); attributeSources.set(node, originals); }
    for (const attr of attrs) {
      const value = node.getAttribute(attr);
      if (value !== null && !originals.has(attr)) originals.set(attr, value);
      const original = originals.get(attr);
      if (original !== undefined) node.setAttribute(attr, translate(locale, original));
    }
    node.childNodes.forEach(visit);
  };
  visit(root);
}

export function useDocumentLocalization(locale: Locale) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    localizeNode(document.body, locale);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => localizeNode(node, locale));
        if (mutation.type === "characterData") {
          const text = mutation.target as Text;
          const original = textSources.get(text);
          if (original === undefined || text.nodeValue !== translate(locale, original)) {
            textSources.set(text, text.nodeValue ?? "");
            text.nodeValue = translate(locale, text.nodeValue ?? "");
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);
}
