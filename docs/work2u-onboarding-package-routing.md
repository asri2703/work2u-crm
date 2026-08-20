# Work2U Onboarding And Package Routing

_Implementation spec untuk survey before login, package recommendation, dan package enforcement._

## 1. Goal

Sistem onboarding perlu:

1. kenal user seawal sebelum login
2. cadangkan package yang sesuai
3. simpan pilihan user secara konsisten
4. pastikan runtime entitlement ikut plan aktif, bukan sekadar label UI

## 2. Survey Fields

Survey ringkas sepatutnya tanya:

1. role atau kerja utama
2. industry
3. team size
4. main channel
5. secondary channels
6. AI mode yang diingini
7. reminder mode
8. workflow complexity
9. permission or SLA needs
10. region
11. language

## 3. Package Recommendation Logic

### Starter

Cadang `Starter` bila:

1. user solo
2. 1 main channel sahaja
3. workflow masih manual
4. AI hanya untuk draft ringan
5. tiada approval flow atau SLA

### Elite

Cadang `Elite` bila:

1. team size 2 hingga 5
2. lebih daripada 1 channel
3. user perlukan automation lebih banyak
4. user mahu reporting lebih stabil
5. AI diperlukan untuk summary, routing, atau workflow assist

### Enterprise

Cadang `Enterprise` bila:

1. team besar atau multi-team
2. custom permission diperlukan
3. workflow approval diperlukan
4. SLA atau governance diperlukan
5. branding, onboarding khas, atau rollout custom diperlukan

## 4. Confidence Scoring

Cadangan score boleh guna prinsip ini:

1. solo + manual + satu channel = Starter score
2. team kecil + multi-channel + automation = Elite score
3. custom workflow / SLA / permission = Enterprise score

Jika jawapan user kabur, confidence score perlu turun dan UI patut tunjuk 2 pilihan paling dekat.

## 5. Persistence Model

### Profile Mirror

`public.profiles` patut simpan:

1. persona
2. primary goal
3. package mirror
4. region
5. language
6. onboarding step
7. setup completion state

### Billing Source Of Truth

`public.subscriptions` dan `public.entitlements` patut jadi source of truth selepas payment disahkan.

### Runtime Rule

1. profile package berguna untuk fast UI render
2. active subscription mengatasi profile mirror
3. entitlement row menentukan limit sebenar
4. usage meters menentukan sama ada limit sudah hampir penuh atau tidak

## 6. Flow

1. visitor buka landing page
2. survey modal muncul
3. user isi jawapan ringkas
4. system cadang package
5. user login guna email atau Google
6. profile auto-sync
7. system apply package mirror awal
8. billing sync mengesahkan package sebenar
9. dashboard render mengikut entitlement aktif

## 7. Copy Guidance

Label yang disyorkan:

1. `Starter` untuk solo user yang mahu kekal murah
2. `Elite` untuk team kecil yang mahu nilai paling berbaloi
3. `Enterprise` untuk workflow, governance, dan support custom

## 8. Admin Override

Super admin boleh:

1. tukar package mirror
2. override entitlement
3. semak audit perubahan
4. bantu user yang masuk plan salah akibat survey tidak lengkap

## 9. Exit Criteria

Onboarding dianggap siap bila:

1. survey boleh dilengkapkan dalam masa singkat
2. recommendation keluar dengan jelas
3. login tidak memutuskan survey data
4. package routing konsisten dengan billing
5. dashboard membaca entitlement yang betul
