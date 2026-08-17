'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateVacancyWizardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  // Form State
  const [title, setTitle] = useState('QA Engineer')
  const [category, setCategory] = useState('IT')
  const [specialty, setSpecialty] = useState('Testing / QA')
  const [vacancyCount, setVacancyCount] = useState(1)

  const [workType, setWorkType] = useState<'office' | 'remote' | 'hybrid'>('office')
  const [city, setCity] = useState('Toshkent')
  const [address, setAddress] = useState('Chilonzor tumani, Bunyodkor ko\'chasi 15-uy')
  const [showMapModal, setShowMapModal] = useState(false)
  const [employmentType, setEmploymentType] = useState('full')
  const [schedules, setSchedules] = useState<string[]>(['5/2'])

  const [salaryType, setSalaryType] = useState<'range' | 'exact' | 'unspecified'>('range')
  const [minSalary, setMinSalary] = useState(8000000)
  const [maxSalary, setMaxSalary] = useState(15000000)
  const [exactSalary, setExactSalary] = useState(10000000)
  const [isTaxIncluded, setIsTaxIncluded] = useState(false)
  const [hasBonus, setHasBonus] = useState(true)
  const [bonusNotes, setBonusNotes] = useState('KPI bo\'yicha har choraklik bonus')

  const [experience, setExperience] = useState('1–3 yil')
  const [education, setEducation] = useState('O\'rta maxsus')
  const [skills, setSkills] = useState<string[]>(['Postman', 'REST API', 'SQL'])
  const [showAddSkillModal, setShowAddSkillModal] = useState(false)
  const [newSkillInput, setNewSkillInput] = useState('')

  const [responsibilities, setResponsibilities] = useState('Avtomatlashtirilgan va qo\'lda testlash o\'tkazish, API funksionalligini tekshirish, bug reportlar tuzish.')
  const [requirements, setRequirements] = useState('Postman va SQL bilimlariga ega bo\'lish, REST API arxitekturasini tushunish.')
  const [offerings, setOfferings] = useState('Keng va yorug\' ofis, bepul tushlik, professional o\'sish imkoniyati.')
  const [languages, setLanguages] = useState([
    { language: 'O\'zbek tili', level: 'C1' },
    { language: 'Rus tili', level: 'B2' },
    { language: 'Ingliz tili', level: 'B1' }
  ])

  const [manager, setManager] = useState('Azizbek Karimov')
  const [contactName, setContactName] = useState('Azizbek Karimov')
  const [contactPhone, setContactPhone] = useState('+998 90 123 45 67')
  const [contactEmail, setContactEmail] = useState('hr@company.uz')
  const [showContacts, setShowContacts] = useState(true)

  const [showModerationModal, setShowModerationModal] = useState(false)

  const titleSuggestions = ['QA Engineer', 'Manual QA', 'Software Tester', 'QA Specialist']

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()])
      setNewSkillInput('')
      setShowAddSkillModal(false)
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const handleSaveDraft = () => {
    alert('Vakansiya Qoralamalar (Drafts) bo\'limida saqlandi!')
    router.push('/hr/vacancies')
  }

  const handleSubmitModeration = () => {
    setShowModerationModal(false)
    alert('Vakansiya moderatsiyaga yuborildi! Administrator tasdiqlagandan so\'ng vakansiya Faol holatga o\'tadi.')
    router.push('/hr/vacancies')
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            ➕ Yangi vakansiya yaratish
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Nomzodlarni jalb qilish uchun vakansiya ma'lumotlarini 6 bosqichda to'ldiring.
          </p>
        </div>
        <Link href="/hr/vacancies" style={{ fontSize: '0.9rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
          ✕ Bekor qilish
        </Link>
      </div>

      {/* Steps Progress Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        padding: '1rem 1.5rem',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        overflowX: 'auto'
      }}>
        {[
          { step: 1, label: 'Asosiy' },
          { step: 2, label: 'Shartlar' },
          { step: 3, label: 'Maosh' },
          { step: 4, label: 'Talablar' },
          { step: 5, label: 'Vazifalar' },
          { step: 6, label: 'Aloqa' },
          { step: 7, label: 'Preview' }
        ].map((s) => {
          const isActive = currentStep === s.step
          const isDone = currentStep > s.step
          return (
            <div
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                opacity: currentStep >= s.step ? 1 : 0.5
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#2563eb' : isDone ? '#10b981' : '#e2e8f0',
                color: isActive || isDone ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isDone ? '✓' : s.step}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#2563eb' : '#1e293b' }}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Step Content Container */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        {/* BOSQICH 1: ASOSIY MA'LUMOTLAR */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              1-bosqich — Asosiy ma'lumotlar
            </h2>

            <div>
              <label style={labelStyle}>Lavozim nomi *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="masalan: QA Engineer"
                style={inputStyle}
              />
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                O‘xshash lavozimlar:{' '}
                {titleSuggestions.map((sug) => (
                  <span
                    key={sug}
                    onClick={() => setTitle(sug)}
                    style={{ color: '#2563eb', cursor: 'pointer', marginRight: '0.5rem', textDecoration: 'underline' }}
                  >
                    {sug}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Kategoriya *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sotuv">Sotuv</option>
                  <option value="HR">HR</option>
                  <option value="Moliya">Moliya</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Mutaxassislik *</label>
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} style={inputStyle}>
                  <option value="Testing / QA">Testing / QA</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="B2B Sales">B2B Sales</option>
                  <option value="Social Media">Social Media</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Nechta xodim kerak?</label>
              <input
                type="number"
                min={1}
                value={vacancyCount}
                onChange={(e) => setVacancyCount(parseInt(e.target.value) || 1)}
                style={{ ...inputStyle, width: '120px' }}
              />
            </div>
          </div>
        )}

        {/* BOSQICH 2: ISH SHARTLARI */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              2-bosqich — Ish shartlari
            </h2>

            <div>
              <label style={labelStyle}>Ishlash joyi *</label>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {(['office', 'remote', 'hybrid'] as const).map((type) => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="workType"
                      checked={workType === type}
                      onChange={() => setWorkType(type)}
                    />
                    {type === 'office' ? 'Ofis' : type === 'remote' ? 'Remote' : 'Gibrid'}
                  </label>
                ))}
              </div>
            </div>

            {workType !== 'remote' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                <div>
                  <label style={labelStyle}>Shahar *</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle}>
                    <option value="Toshkent">Toshkent</option>
                    <option value="Samarqand">Samarqand</option>
                    <option value="Buxoro">Buxoro</option>
                    <option value="Andijon">Andijon</option>
                    <option value="Namangan">Namangan</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Manzil</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Chilonzor tumani, Bunyodkor ko'chasi..."
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      onClick={() => setShowMapModal(true)}
                      style={{
                        padding: '0.6rem 1rem',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      📍 Manzilni tanlash
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label style={labelStyle}>Bandlik turi *</label>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {[
                  { id: 'full', label: 'To‘liq' },
                  { id: 'part', label: 'Qisman' },
                  { id: 'internship', label: 'Stajirovka' },
                  { id: 'temporary', label: 'Vaqtinchalik' }
                ].map((b) => (
                  <label key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="employmentType"
                      checked={employmentType === b.id}
                      onChange={() => setEmploymentType(b.id)}
                    />
                    {b.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Ish grafigi *</label>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {['5/2', '6/1', 'Moslashuvchan', 'Smenali'].map((sch) => {
                  const checked = schedules.includes(sch)
                  return (
                    <label key={sch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) setSchedules([...schedules, sch])
                          else setSchedules(schedules.filter(s => s !== sch))
                        }}
                      />
                      {sch}
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* BOSQICH 3: MAOSH */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              3-bosqich — Maosh
            </h2>

            <div>
              <label style={labelStyle}>Maosh ko'rsatish shakli *</label>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {[
                  { id: 'unspecified', label: 'Maosh ko‘rsatilmaydi' },
                  { id: 'range', label: 'Diapazon' },
                  { id: 'exact', label: 'Aniq summa' }
                ].map((s) => (
                  <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="salaryType"
                      checked={salaryType === s.id}
                      onChange={() => setSalaryType(s.id as any)}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>

            {salaryType === 'range' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Minimal (so'm)</label>
                    <input
                      type="number"
                      value={minSalary}
                      onChange={(e) => setMinSalary(parseInt(e.target.value) || 0)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Maksimal (so'm)</label>
                    <input
                      type="number"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(parseInt(e.target.value) || 0)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="tax"
                      checked={!isTaxIncluded}
                      onChange={() => setIsTaxIncluded(false)}
                    />
                    Soliqdan oldin (Gross)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="tax"
                      checked={isTaxIncluded}
                      onChange={() => setIsTaxIncluded(true)}
                    />
                    Soliqdan keyin (Net)
                  </label>
                </div>
              </div>
            )}

            {salaryType === 'exact' && (
              <div>
                <label style={labelStyle}>Aniq summa (so'm)</label>
                <input
                  type="number"
                  value={exactSalary}
                  onChange={(e) => setExactSalary(parseInt(e.target.value) || 0)}
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <label style={labelStyle}>💰 Bonus</label>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="bonus"
                    checked={hasBonus}
                    onChange={() => setHasBonus(true)}
                  />
                  Bor
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="bonus"
                    checked={!hasBonus}
                    onChange={() => setHasBonus(false)}
                  />
                  Yo‘q
                </label>
              </div>

              {hasBonus && (
                <div>
                  <label style={labelStyle}>Bonus haqida qisqacha</label>
                  <input
                    type="text"
                    value={bonusNotes}
                    onChange={(e) => setBonusNotes(e.target.value)}
                    placeholder="KPI bo'yicha har oylik/choraklik bonus..."
                    style={inputStyle}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOSQICH 4: TALABLAR */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              4-bosqich — Talablar
            </h2>

            <div>
              <label style={labelStyle}>Tajriba *</label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['Talab qilinmaydi', '1 yilgacha', '1–3 yil', '3–6 yil', '6+ yil'].map((exp) => (
                  <label key={exp} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="experience"
                      checked={experience === exp}
                      onChange={() => setExperience(exp)}
                    />
                    {exp}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Ta'lim</label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['Talab qilinmaydi', 'O‘rta', 'O‘rta maxsus', 'Oliy'].map((edu) => (
                  <label key={edu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="education"
                      checked={education === edu}
                      onChange={() => setEducation(edu)}
                    />
                    {edu}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Kerakli ko'nikmalar</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: '0.4rem 0.85rem',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 800 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <button
                onClick={() => setShowAddSkillModal(true)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f1f5f9',
                  color: '#1e293b',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                + Ko‘nikma qo‘shish
              </button>
            </div>
          </div>
        )}

        {/* BOSQICH 5: VAZIFALAR VA TALABLAR */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              5-bosqich — Vazifalar va talablar
            </h2>

            <div>
              <label style={labelStyle}>Asosiy vazifalar</label>
              <textarea
                rows={3}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="Bu lavozimda nimalar qilinadi?"
                style={{ ...inputStyle, fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Nomzodga qo'yiladigan talablar</label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Qanday ko'nikmalar talab qilinadi?"
                style={{ ...inputStyle, fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Biz taklif qilamiz</label>
              <textarea
                rows={3}
                value={offerings}
                onChange={(e) => setOfferings(e.target.value)}
                placeholder="Kompaniya tomondan beriladigan imtiyozlar..."
                style={{ ...inputStyle, fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Tillar</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {languages.map((langItem, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ width: '120px', fontWeight: 600 }}>{langItem.language}</span>
                    <select
                      value={langItem.level}
                      onChange={(e) => {
                        const updated = [...languages]
                        updated[idx].level = e.target.value
                        setLanguages(updated)
                      }}
                      style={{ ...inputStyle, width: '120px' }}
                    >
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOSQICH 6: ALOQA VA QABUL QILISH */}
        {currentStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              6-bosqich — Aloqa va qabul qilish
            </h2>

            <div>
              <label style={labelStyle}>Vakansiya menejeri *</label>
              <select value={manager} onChange={(e) => setManager(e.target.value)} style={inputStyle}>
                <option value="Azizbek Karimov">Azizbek Karimov</option>
                <option value="Madina Aliyeva">Madina Aliyeva</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>F.I.Sh.</label>
                <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={showContacts}
                  onChange={(e) => setShowContacts(e.target.checked)}
                />
                ☑ Vakansiyada kontaktlarni ko‘rsatish
              </label>
            </div>
          </div>
        )}

        {/* PREVIEW STEP */}
        {currentStep === 7 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Vakansiya ko'rinishi (Preview)
            </h2>

            <div style={{
              border: '2px dashed #3b82f6',
              borderRadius: '16px',
              padding: '1.75rem',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{title}</h3>
                  <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '1rem', marginTop: '0.2rem' }}>TechSolutions Co.</div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#16a34a' }}>
                  {salaryType === 'range' ? `${(minSalary / 1000000).toFixed(0)}–${(maxSalary / 1000000).toFixed(0)} mln so‘m` : 'Maosh kelishilgan'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
                <span>📍 {city} ({workType})</span>
                <span>💼 Tajriba: {experience}</span>
                <span>🎓 Ta'lim: {education}</span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Ko'nikmalar:</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {skills.map(s => (
                    <span key={s} style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Vazifalar:</div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155' }}>{responsibilities}</p>
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Talablar:</div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155' }}>{requirements}</p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ← Orqaga
            </button>
          ) : <div />}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleSaveDraft}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#334155',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              💾 Qoralama saqlash
            </button>

            {currentStep < 7 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Saqlash va davom etish →
              </button>
            ) : (
              <button
                onClick={() => setShowModerationModal(true)}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🚀 Moderatsiyaga yuborish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800 }}>+ Ko'nikma qo'shish</h3>
            <input
              type="text"
              placeholder="Ko'nikma nomi..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              style={inputStyle}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button onClick={() => setShowAddSkillModal(false)} style={cancelBtnStyle}>Bekor qilish</button>
              <button onClick={handleAddSkill} style={primaryBtnStyle}>Qo'shish</button>
            </div>
          </div>
        </div>
      )}

      {/* Map Picker Modal Simulation */}
      {showMapModal && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800 }}>📍 Xaritada manzilni tanlash</h3>
            <div style={{ height: '200px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#64748b' }}>
              [ Interactive Map View ]
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button onClick={() => setShowMapModal(false)} style={primaryBtnStyle}>Manzilni tasdiqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Submission Modal */}
      {showModerationModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '1.25rem' }}>Vakansiyani yuborish</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1rem 0' }}>
              Vakansiya: <strong>{title}</strong>
            </p>
            <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}>Tekshirib chiqing:</div>
              <div style={{ color: '#15803d', fontSize: '0.85rem' }}>✓ Lavozim va Kategoriya kiritilgan</div>
              <div style={{ color: '#15803d', fontSize: '0.85rem' }}>✓ Maosh shartlari ko'rsatilgan</div>
              <div style={{ color: '#15803d', fontSize: '0.85rem' }}>✓ Talablar va vazifalar to'liq</div>
              <div style={{ color: '#15803d', fontSize: '0.85rem' }}>✓ Kontakt ma'lumotlari tasdiqlangan</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowModerationModal(false)} style={cancelBtnStyle}>Bekor qilish</button>
              <button onClick={handleSubmitModeration} style={primaryBtnStyle}>Moderatsiyaga yuborish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 700,
  color: '#1e293b',
  marginBottom: '0.4rem'
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.9rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.9rem',
  outline: 'none'
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
}

const modalBoxStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '1.75rem',
  width: '90%',
  maxWidth: '420px',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
}

const cancelBtnStyle: React.CSSProperties = {
  padding: '0.55rem 1rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#ffffff',
  fontWeight: 600,
  cursor: 'pointer'
}

const primaryBtnStyle: React.CSSProperties = {
  padding: '0.55rem 1rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontWeight: 700,
  cursor: 'pointer'
}
