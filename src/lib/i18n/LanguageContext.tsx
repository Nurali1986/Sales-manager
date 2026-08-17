'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'uz' | 'ru' | 'en'

export const translations = {
  uz: {
    // Home & General
    title: 'AI Sales Recruitment Assessment Platformasi',
    subtitle: 'Sotuv menejerlarini real ish qobiliyati va AI simulyatsiyalari orqali baholash platformasi',
    hrButtonTitle: 'HR Dashboard',
    hrButtonDesc: 'Vakansiyalar yaratish, nomzodlar ro\'yxati va AI baholarini ko\'rish',
    candidateButtonTitle: 'Nomzod Assessment',
    candidateButtonDesc: 'Sotuv bo\'yicha amaliy topshiriqlar va AI simulyatsiyasini topshirish',
    selectRole: 'Tizimga kirish turini tanlang',
    demoNotice: 'Demo rejim: Tayyor assessment havolasi bilan sinab ko\'rish imkoniyati',
    featuresTitle: 'Platforma imkoniyatlari',
    feature1Title: 'AI Live Sales Simulation',
    feature1Desc: 'AI mijoz bilan ovozli va matnli real vaqtdagi sotuv muloqoti',
    feature2Title: 'Xolis va Aniq AI Ball',
    feature2Desc: '100 ballik shaffof baholash va dalillar bilan asoslangan izohlar',
    feature3Title: 'Vaqtni 80% ga tejash',
    feature3Desc: 'Yuzlab CVlarni qo\'lda ko\'rib chiqish o\'rniga eng kuchli TOP nomzodlarni aniqlash',
    footerRights: 'Barcha huquqlar himoyalangan.',

    // Common UI
    next: 'Keyingisi',
    back: 'Orqaga',
    submit: 'Yuborish',
    submitting: 'Yuborilmoqda...',
    save: 'Saqlash',
    saving: 'Saqlanmoqda...',
    completed: 'Yakunlandi',
    inProgress: 'Jarayonda',
    notStarted: 'Boshlanmagan',
    required: 'Majburiy',
    optional: 'Ixtiyoriy',

    // Assessment Stages Header
    salesAssessmentTitle: 'Sales Manager Assessment',
    salesAssessmentSub: 'Ushbu assessment sizning sotuv menejeri lavozimiga mosligingizni amaliy vazifalar orqali baholaydi.',
    estimatedTime: 'Taxminiy vaqt: 25–35 daqiqa',
    stageProfile: 'Profil',
    stageCV: 'CV yuklash',
    stageTest: 'Sales Test',
    stageCase: 'Sales Case',
    stageScript: 'Sales Script',
    stageSim: 'AI Simulyatsiya',
    stageVideo: 'Video Topshiriq',

    // Candidate Profile Page
    profileTitle: 'Shaxsiy ma\'lumotlar',
    profileDesc: 'Iltimos, ismingiz va aloqa ma\'lumotlaringizni kiriting.',
    firstNameLabel: 'Ismingiz',
    lastNameLabel: 'Familiyangiz',
    phoneLabel: 'Telefon raqamingiz',
    emailLabel: 'Email (ixtiyoriy)',
    cityLabel: 'Shahar (ixtiyoriy)',
    startAssessment: 'Assessmentni boshlash',

    // Candidate CV Page
    cvTitle: 'CV (Rezyume) yuklash',
    cvDesc: 'Rezyumeingizni PDF yoki DOCX formatida yuklang (Maksimal 10MB).',
    dragDropText: 'Faylni shu yerga tashlang yoki kompyuterdan tanlang',
    uploadBtn: 'CV yuklash',
    cvUploadedSuccess: 'CV muvaffaqiyatli yuklandi!',

    // Candidate Knowledge Test Page
    testTitle: 'Sales Knowledge Test',
    testDesc: 'Sotuv metodologiyasi va mijoz bilan muloqot bo\'yicha 10 ta savol.',
    questionNum: 'Savol',
    ofText: 'dan',
    nextQuestion: 'Keyingi savol',
    finishTestBtn: 'Testni yakunlash',

    // Candidate Case Page
    caseTitle: 'Sales Case Topshirig\'i',
    caseDesc: 'Haqiqiy biznes stsenariysi bo\'yicha amaliy javob yozing.',
    caseScenario: 'Tasavvur qiling, siz mebel fabrikasida Sales Manager bo\'lib ish boshladingiz. Yangi mijoz kelganidan buyurtma yopilgunga qadar bajariladigan ishlar ketma-ketligini batafsil yozing.',
    casePlaceholder: 'Javobingizni shu yerga yozing...',

    // Candidate Script Page
    scriptTitle: 'Sales Script Yozish',
    scriptDesc: 'Mebel fabrikasi uchun telefon orqali sotuv scriptini yozing.',
    scriptPrompt: 'Salomlashish, ehtiyojni aniqlash, mahsulot taqdimoti, e\'tirozlar bilan ishlash va kelishuvni yopish bosqichlarini o\'z ichiga olsin.',
    scriptPlaceholder: 'Sales script matnini shu yerga kiriting...',

    // Candidate Simulation Page
    simTitle: 'AI Customer Live Sales Simulation',
    simDesc: 'AI mijoz bilan real vaqtdagi sotuv muloqoti.',
    micNotice: 'Suhbat uchun mikrofonga ruxsat berishingiz kerak.',
    allowMicBtn: 'Mikrofonga ruxsat berish',
    startSimBtn: 'Suhbatni boshlash',
    aiConnected: 'AI Mijoz ulangan',
    typeSimMessage: 'Javobingizni yozing...',
    sendBtn: 'Yuborish',
    endSimBtn: 'Suhbatni yakunlash',

    // Candidate Video Page & Recorder Component
    videoTitle: '60 soniyalik Video Taqdimot',
    videoDesc: '60 soniya ichida mijozga nima uchun aynan bizdan mebel sotib olishi kerakligini tushuntiring.',
    cameraReqTitle: 'Kamera va Mikrofonga ruxsat',
    cameraReqDesc: 'Videoni yozish uchun kamera va mikrofonga ruxsat bering.',
    allowCameraBtn: 'Kamerani yoqish',
    startRecordingBtn: 'Yozishni boshlash',
    stopRecordingBtn: 'To\'xtatish',
    rerecordBtn: 'Qayta yozish',
    submitVideoBtn: 'Videoni yuborish',
    uploadingVideoMsg: 'Video yuklanmoqda va AI tahlil qilinmoqda...',
    secLeft: 'soniya qoldi',

    // Candidate Completed Page
    congratsTitle: 'Tabriklaymiz! Assessment yakunlandi.',
    congratsDesc: 'Barcha topshiriqlaringiz qabul qilindi. AI tizimi javoblaringizni tahlil qilmoqda. HR tez orada siz bilan bog\'lanadi.',
    backToHome: 'Bosh sahifaga qaytish',

    // HR System
    hrLoginTitle: 'HR Tizimiga kirish',
    hrLoginDesc: 'Kompaniya va vakansiyalarni boshqarish uchun tizimga kiring.',
    emailInput: 'Email manzilingiz',
    passwordInput: 'Parolingiz',
    loginSubmit: 'Tizimga kirish',
    dashboardNav: 'Dashboard',
    vacanciesNav: 'Vakansiyalar',
    candidatesNav: 'Nomzodlar',
    logoutNav: 'Chiqish',

    // HR Dashboard Stats
    activeVacancies: 'Faol vakansiyalar',
    totalCandidates: 'Jami nomzodlar',
    assessmentsCompleted: 'Yakunlangan assessmentlar',
    pendingReview: 'Ko\'rib chiqilmoqda',
    shortlisted: 'Saralanganlar',
    avgScore: 'O\'rtacha kompaniya bali',
    recentCandidates: 'So\'nggi nomzodlar',
    viewAllCandidates: 'Barcha nomzodlarni ko\'rish',

    // HR Candidates Page
    candidatesTitle: 'Nomzodlar Ro\'yxati',
    filterByStatus: 'Status bo\'yicha filtr',
    sortByScore: 'Ball bo\'yicha saralash',
    candidateName: 'Nomzod',
    candidatePhone: 'Telefon',
    candidateScore: 'Umumiy Ball',
    candidateStatus: 'Status',
    actionView: 'Ko\'rib chiqish',

    // HR Candidate Detail Page
    candidateDetailTitle: 'Nomzod Profili',
    finalScoreLabel: 'Yakuniy AI Balli',
    hrDecisionLabel: 'HR Qarori',
    aiRecommendationLabel: 'AI Tavsiyasi',
    strengthsTitle: 'Kuchli tomonlari',
    weaknessesTitle: 'Rivojlantirish kerak bo\'lgan tomonlari',
    viewCVBtn: 'CV (Rezyume) ko\'rish',
    stageBreakdownTitle: 'Bosqichlar bo\'yicha ballar',
    evidenceText: 'Dalil va misollar',

    // HR Vacancy New Page
    createVacancyTitle: 'Yangi Vakansiya Yaratish',
    createVacancyDesc: 'Kompaniya uchun yangi sotuv menejeri vakansiyasini e\'lon qiling.',
    vacancyTitleLabel: 'Vakansiya Nomi',
    departmentLabel: 'Bo\'lim',
    employmentTypeLabel: 'Bandlik turi',
    descriptionLabel: 'Batafsil ma\'lumot va talablar',
    createVacancyBtn: 'Vakansiyani yaratish',
    creatingVacancyMsg: 'Vakansiya yaratilmoqda...'
  },
  ru: {
    // Home & General
    title: 'Платформа Оценки Кандидатов в Продажи на Базе ИИ',
    subtitle: 'Оценка практических навыков менеджеров по продажам с помощью ИИ-симуляций',
    hrButtonTitle: 'HR Дашборд',
    hrButtonDesc: 'Создание вакансий, список кандидатов и результаты ИИ-оценки',
    candidateButtonTitle: 'Тест Кандидата',
    candidateButtonDesc: 'Прохождение практических заданий и живой ИИ-симуляции продаж',
    selectRole: 'Выберите режим входа в систему',
    demoNotice: 'Демо режим: Тестирование по готовой ссылке ассессмента',
    featuresTitle: 'Возможности платформы',
    feature1Title: 'Живая ИИ-Симуляция Продаж',
    feature1Desc: 'Интерактивный диалог продаж с ИИ-клиентом в реальном времени',
    feature2Title: 'Объективный ИИ-Балл',
    feature2Desc: 'Прозрачная 100-балльная оценка с доказательствами и аргументацией',
    feature3Title: 'Экономия 80% Времени HR',
    feature3Desc: 'Быстрый отбор ТОП-кандидатов вместо ручного разбора сотен резюме',
    footerRights: 'Все права защищены.',

    // Common UI
    next: 'Далее',
    back: 'Назад',
    submit: 'Отправить',
    submitting: 'Отправка...',
    save: 'Сохранить',
    saving: 'Сохранение...',
    completed: 'Завершено',
    inProgress: 'В процессе',
    notStarted: 'Не начато',
    required: 'Обязательно',
    optional: 'Необязательно',

    // Assessment Stages Header
    salesAssessmentTitle: 'Оценка Менеджера по Продажам',
    salesAssessmentSub: 'Этот ассессмент оценивает ваши практические навыки продаж.',
    estimatedTime: 'Примерное время: 25–35 минут',
    stageProfile: 'Профиль',
    stageCV: 'Загрузка резюме',
    stageTest: 'Тест продаж',
    stageCase: 'Продажи Case',
    stageScript: 'Скрипт продаж',
    stageSim: 'ИИ Симуляция',
    stageVideo: 'Видеозадание',

    // Candidate Profile Page
    profileTitle: 'Личные данные',
    profileDesc: 'Пожалуйста, введите ваше имя и контактные данные.',
    firstNameLabel: 'Ваше имя',
    lastNameLabel: 'Ваша фамилия',
    phoneLabel: 'Номер телефона',
    emailLabel: 'Email (опционально)',
    cityLabel: 'Город (опционально)',
    startAssessment: 'Начать ассессмент',

    // Candidate CV Page
    cvTitle: 'Загрузка Резюме (CV)',
    cvDesc: 'Загрузите ваше резюме в формате PDF или DOCX (Максимум 10 МБ).',
    dragDropText: 'Перетащите файл сюда или выберите с компьютера',
    uploadBtn: 'Загрузить CV',
    cvUploadedSuccess: 'Резюме успешно загружено!',

    // Candidate Knowledge Test Page
    testTitle: 'Тест Знаний Продаж',
    testDesc: '10 вопросов по методологии продаж и коммуникации с клиентом.',
    questionNum: 'Вопрос',
    ofText: 'из',
    nextQuestion: 'Следующий вопрос',
    finishTestBtn: 'Завершить тест',

    // Candidate Case Page
    caseTitle: 'Задание Sales Case',
    caseDesc: 'Напишите практический ответ по реальному бизнес-сценарию.',
    caseScenario: 'Представьте, что вы начали работать менеджером по продажам на мебельной фабрике. Опишите последовательность действий от прихода нового клиента до закрытия сделки.',
    casePlaceholder: 'Напишите ваш ответ здесь...',

    // Candidate Script Page
    scriptTitle: 'Составление Скрипта Продаж',
    scriptDesc: 'Напишите телефонный скрипт продаж для мебельной фабрики.',
    scriptPrompt: 'Включите приветствие, выявление потребностей, презентацию продукта, работу с возражениями и закрытие сделки.',
    scriptPlaceholder: 'Введите текст скрипта здесь...',

    // Candidate Simulation Page
    simTitle: 'Живая ИИ-Симуляция Продаж',
    simDesc: 'Интерактивные переговоры с ИИ-клиентом в реальном времени.',
    micNotice: 'Для проведения беседы требуется доступ к микрофону.',
    allowMicBtn: 'Разрешить микрофон',
    startSimBtn: 'Начать диалог',
    aiConnected: 'ИИ-Клиент подключен',
    typeSimMessage: 'Введите ваш ответ...',
    sendBtn: 'Отправить',
    endSimBtn: 'Завершить диалог',

    // Candidate Video Page & Recorder Component
    videoTitle: '60-секундная Видеопрезентация',
    videoDesc: 'Объясните клиенту за 60 секунд, почему именно у нас нужно купить мебель.',
    cameraReqTitle: 'Доступ к Камере и Микрофону',
    cameraReqDesc: 'Разрешите доступ к камере и микрофону для записи видео.',
    allowCameraBtn: 'Включить камеру',
    startRecordingBtn: 'Начать запись',
    stopRecordingBtn: 'Остановить',
    rerecordBtn: 'Записать заново',
    submitVideoBtn: 'Отправить видео',
    uploadingVideoMsg: 'Загрузка видео и ИИ-анализ...',
    secLeft: 'сек осталось',

    // Candidate Completed Page
    congratsTitle: 'Поздравляем! Ассессмент завершен.',
    congratsDesc: 'Все ваши задания приняты. ИИ-система анализирует ответы. HR свяжется с вами в ближайшее время.',
    backToHome: 'На главную',

    // HR System
    hrLoginTitle: 'Вход в систему HR',
    hrLoginDesc: 'Войдите для управления компанией и вакансиями.',
    emailInput: 'Ваш Email',
    passwordInput: 'Ваш пароль',
    loginSubmit: 'Войти',
    dashboardNav: 'Дашборд',
    vacanciesNav: 'Вакансии',
    candidatesNav: 'Кандидаты',
    logoutNav: 'Выйти',

    // HR Dashboard Stats
    activeVacancies: 'Активные вакансии',
    totalCandidates: 'Всего кандидатов',
    assessmentsCompleted: 'Завершенные тесты',
    pendingReview: 'На рассмотрении',
    shortlisted: 'Отобранные',
    avgScore: 'Средний балл компании',
    recentCandidates: 'Последние кандидаты',
    viewAllCandidates: 'Посмотреть всех кандидатов',

    // HR Candidates Page
    candidatesTitle: 'Список Кандидатов',
    filterByStatus: 'Фильтр по статусу',
    sortByScore: 'Сортировка по баллу',
    candidateName: 'Кандидат',
    candidatePhone: 'Телефон',
    candidateScore: 'Общий Балл',
    candidateStatus: 'Статус',
    actionView: 'Просмотр',

    // HR Candidate Detail Page
    candidateDetailTitle: 'Профиль Кандидата',
    finalScoreLabel: 'Итоговый ИИ-Балл',
    hrDecisionLabel: 'Решение HR',
    aiRecommendationLabel: 'Рекомендация ИИ',
    strengthsTitle: 'Сильные стороны',
    weaknessesTitle: 'Области для развития',
    viewCVBtn: 'Просмотреть Резюме (CV)',
    stageBreakdownTitle: 'Баллы по этапам',
    evidenceText: 'Доказательства и примеры',

    // HR Vacancy New Page
    createVacancyTitle: 'Создание Новой Вакансии',
    createVacancyDesc: 'Опубликуйте новую вакансию менеджера по продажам.',
    vacancyTitleLabel: 'Название Вакансии',
    departmentLabel: 'Отдел',
    employmentTypeLabel: 'Тип занятости',
    descriptionLabel: 'Подробное описание и требования',
    createVacancyBtn: 'Создать вакансию',
    creatingVacancyMsg: 'Создание вакансии...'
  },
  en: {
    // Home & General
    title: 'AI Sales Recruitment Assessment Platform',
    subtitle: 'Evaluate sales candidates through practical tasks and real-time AI simulations',
    hrButtonTitle: 'HR Dashboard',
    hrButtonDesc: 'Create vacancies, review candidate rankings and AI evaluations',
    candidateButtonTitle: 'Candidate Assessment',
    candidateButtonDesc: 'Take practical sales challenges and live AI customer simulation',
    selectRole: 'Select entry point',
    demoNotice: 'Demo mode: Test with a pre-configured assessment link',
    featuresTitle: 'Platform Features',
    feature1Title: 'AI Live Sales Simulation',
    feature1Desc: 'Real-time interactive sales conversation with an AI customer',
    feature2Title: 'Objective & Explainable AI Score',
    feature2Desc: 'Transparent 100-point rubric with evidence-based feedback',
    feature3Title: 'Save 80% HR Screening Time',
    feature3Desc: 'Identify top sales talent quickly without reading hundreds of CVs',
    footerRights: 'All rights reserved.',

    // Common UI
    next: 'Next',
    back: 'Back',
    submit: 'Submit',
    submitting: 'Submitting...',
    save: 'Save',
    saving: 'Saving...',
    completed: 'Completed',
    inProgress: 'In Progress',
    notStarted: 'Not Started',
    required: 'Required',
    optional: 'Optional',

    // Assessment Stages Header
    salesAssessmentTitle: 'Sales Manager Assessment',
    salesAssessmentSub: 'This assessment evaluates your sales competency through practical tasks.',
    estimatedTime: 'Estimated duration: 25–35 minutes',
    stageProfile: 'Profile',
    stageCV: 'CV Upload',
    stageTest: 'Sales Test',
    stageCase: 'Sales Case',
    stageScript: 'Sales Script',
    stageSim: 'AI Simulation',
    stageVideo: 'Video Task',

    // Candidate Profile Page
    profileTitle: 'Personal Details',
    profileDesc: 'Please enter your name and contact information.',
    firstNameLabel: 'First Name',
    lastNameLabel: 'Last Name',
    phoneLabel: 'Phone Number',
    emailLabel: 'Email (optional)',
    cityLabel: 'City (optional)',
    startAssessment: 'Start Assessment',

    // Candidate CV Page
    cvTitle: 'Upload CV / Resume',
    cvDesc: 'Upload your CV in PDF or DOCX format (Max 10MB).',
    dragDropText: 'Drag and drop your file here or click to browse',
    uploadBtn: 'Upload CV',
    cvUploadedSuccess: 'CV uploaded successfully!',

    // Candidate Knowledge Test Page
    testTitle: 'Sales Knowledge Test',
    testDesc: '10 questions covering sales methodology and customer negotiation.',
    questionNum: 'Question',
    ofText: 'of',
    nextQuestion: 'Next Question',
    finishTestBtn: 'Finish Test',

    // Candidate Case Page
    caseTitle: 'Sales Case Task',
    caseDesc: 'Write a practical answer to a realistic business scenario.',
    caseScenario: 'Imagine you started working as a Sales Manager at a furniture factory. Write out the sequence of steps from customer entry to closing the order.',
    casePlaceholder: 'Type your detailed answer here...',

    // Candidate Script Page
    scriptTitle: 'Sales Script Task',
    scriptDesc: 'Write a phone sales script for a furniture factory.',
    scriptPrompt: 'Include greeting, needs discovery, product presentation, objection handling, and deal closing.',
    scriptPlaceholder: 'Type your sales script here...',

    // Candidate Simulation Page
    simTitle: 'AI Customer Live Sales Simulation',
    simDesc: 'Real-time interactive sales conversation with an AI customer.',
    micNotice: 'Microphone permission is required for the sales dialogue.',
    allowMicBtn: 'Allow Microphone',
    startSimBtn: 'Start Conversation',
    aiConnected: 'AI Customer Connected',
    typeSimMessage: 'Type your response...',
    sendBtn: 'Send',
    endSimBtn: 'End Conversation',

    // Candidate Video Page & Recorder Component
    videoTitle: '60-Second Video Pitch',
    videoDesc: 'Explain to a potential customer within 60 seconds why they should buy furniture from our factory.',
    cameraReqTitle: 'Camera & Microphone Access',
    cameraReqDesc: 'Allow camera and microphone access to record your video pitch.',
    allowCameraBtn: 'Enable Camera',
    startRecordingBtn: 'Start Recording',
    stopRecordingBtn: 'Stop Recording',
    rerecordBtn: 'Record Again',
    submitVideoBtn: 'Submit Video',
    uploadingVideoMsg: 'Uploading video and processing AI analysis...',
    secLeft: 'sec left',

    // Candidate Completed Page
    congratsTitle: 'Congratulations! Assessment Completed.',
    congratsDesc: 'All your tasks have been received. Our AI system is processing your results. HR will contact you shortly.',
    backToHome: 'Back to Home',

    // HR System
    hrLoginTitle: 'HR System Login',
    hrLoginDesc: 'Log in to manage company jobs and candidates.',
    emailInput: 'Email Address',
    passwordInput: 'Password',
    loginSubmit: 'Sign In',
    dashboardNav: 'Dashboard',
    vacanciesNav: 'Vacancies',
    candidatesNav: 'Candidates',
    logoutNav: 'Sign Out',

    // HR Dashboard Stats
    activeVacancies: 'Active Vacancies',
    totalCandidates: 'Total Candidates',
    assessmentsCompleted: 'Assessments Completed',
    pendingReview: 'Pending Review',
    shortlisted: 'Shortlisted',
    avgScore: 'Avg Company Score',
    recentCandidates: 'Recent Candidates',
    viewAllCandidates: 'View All Candidates',

    // HR Candidates Page
    candidatesTitle: 'Candidate Ranking & List',
    filterByStatus: 'Filter by Status',
    sortByScore: 'Sort by Score',
    candidateName: 'Candidate',
    candidatePhone: 'Phone',
    candidateScore: 'Overall Score',
    candidateStatus: 'Status',
    actionView: 'Review',

    // HR Candidate Detail Page
    candidateDetailTitle: 'Candidate Profile',
    finalScoreLabel: 'Final AI Score',
    hrDecisionLabel: 'HR Decision',
    aiRecommendationLabel: 'AI Recommendation',
    strengthsTitle: 'Key Strengths',
    weaknessesTitle: 'Areas for Growth',
    viewCVBtn: 'View CV / Resume',
    stageBreakdownTitle: 'Stage Score Breakdown',
    evidenceText: 'Evidence and Examples',

    // HR Vacancy New Page
    createVacancyTitle: 'Create New Vacancy',
    createVacancyDesc: 'Publish a new Sales Manager vacancy for your company.',
    vacancyTitleLabel: 'Job Title',
    departmentLabel: 'Department',
    employmentTypeLabel: 'Employment Type',
    descriptionLabel: 'Job Description & Requirements',
    createVacancyBtn: 'Create Vacancy',
    creatingVacancyMsg: 'Creating vacancy...'
  }
}

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: typeof translations['uz']
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'uz',
  setLang: () => {},
  t: translations.uz,
})

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>('uz')

  useEffect(() => {
    const saved = localStorage.getItem('app_lang') as Language
    if (saved && ['uz', 'ru', 'en'].includes(saved)) {
      queueMicrotask(() => {
        setLangState(saved)
      })
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('app_lang', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
