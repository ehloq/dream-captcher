app.use(async (req, res, next) => {
    const userAgent = req.get("User-Agent").toLowerCase();
    const currentRoute = req.originalUrl;
    const standardFile = path.join(__dirname + '/public/standard.js');

    const result = isbot(req.get('user-agent'));

    // console.log("userAgent => ", userAgent);
    console.log(`ES BOT: ${result} => ${req.get('user-agent')}`);

    // TELEGRAM BOTS
    // telegrambot (like twitterbot)

    // FACEBOOK BOTS
    // userAgent =>  facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // userAgent =>  facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // userAgent =>  facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // userAgent =>  supportsfresco=1 modular=2 dalvik/2.1.0 (linux; u; android 12; pixel 3 xl build/sp1a.210812.016.c1) [fban/ema;fbbv/538547666;fbav/382.0.0.11.115;fbdv/pixel 3 xl;fbsv/12;fbcx/okhttp3;fbdm/{density=3.5}] 
    // TODO userAgent =>  mozilla/5.0 (linux; android 12; vivo 1920 build/sp1a.210812.003; wv) applewebkit/537.36 (khtml, like gecko) version/4.0 chrome/119.0.6045.66 mobile safari/537.36 [fb_iab/fb4a;fbav/435.0.0.32.108;]      
    // userAgent =>  facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // userAgent =>  facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)

    // FACEBOOK BOTS
    // userAgent =>  facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // userAgent =>  facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // userAgent =>  facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // userAgent =>  supportsfresco=1 modular=3 dalvik/2.1.0 (linux; u; android 12; tecno bf6 build/sp1a.210812.001) [fban/ema;fbbv/538547664;fbav/382.0.0.11.115;fbdv/tecno bf6;fbsv/12;fbcx/okhttp3;fbdm/{density=2.0}]
    // TODO userAgent =>  mozilla/5.0 (linux; android 12; sm-a045f build/sp1a.210812.016; wv) applewebkit/537.36 (khtml, like gecko) version/4.0 chrome/112.0.5615.136 mobile safari/537.36 [fban/ema;fblc/en_gb;fbav/351.0.0.6.115;fbdm/displaymetrics{density=1.875, width=720, height=1465, scaleddensity=1.875, xdpi=269.21, ydpi=269.21};]
    // userAgent =>  facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // userAgent =>  facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)

    // FACEBOOKS BOTS
    // ES BOT: true => facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // ES BOT: true => facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // ES BOT: true => facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // TODO ES BOT: false => Mozilla/5.0 (Linux; Android 12; TECNO BF6 Build/SP1A.210812.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/105.0.5195.136 Mobile Safari/537.36 [FBAN/AudienceNetworkForWindows;FBDV/TECNO BF6;FBSV/12;FBAV/364.0.0.14.77;FBLC/fr_FR]
    // TODO ES BOT: false => Mozilla/5.0 (Linux; Android 12; TECNO BF6 Build/SP1A.210812.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/105.0.5195.136 Mobile Safari/537.36 [FBAN/AudienceNetworkForWindows;FBDV/TECNO BF6;FBSV/12;FBAV/364.0.0.14.77;FBLC/fr_FR]
    // TODO ES BOT: false => Mozilla/5.0 (Linux; Android 12; SM-A125U Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.67 Mobile Safari/537.36 [FBAN/EMA;FBLC/en_US;FBAV/382.0.0.11.115;FBDM/DisplayMetrics{density=1.875, width=720, height=1465, scaledDensity=1.875, xdpi=268.941, ydpi=269.139};]
    // ES BOT: true => facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // ES BOT: true => facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
    // ES BOT: false => Mozilla/5.0 (Linux; Android 13; SM-G990U2 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.66 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/435.0.0.32.108;]
    // TODO ES BOT: false => Mozilla/5.0 (Linux; Android 13; SM-G990U2 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.66 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/435.0.0.32.108;]
    // TODO ES BOT: false => Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 LightSpeed [FBAN/MessengerLiteForiOS;FBAV/392.0.0.35.101;FBBV/438833785;FBDV/iPhone12,5;FBMD/iPhone;FBSN/iOS;FBSV/16.1.2;FBSS/3;FBCR/;FBID/phone;FBLC/es;FBOP/0]

    // WHATSAPP BOTS
    // whatsapp/2.23.20.0

    // YO FACEBOOK
    // mozilla/5.0 (linux; android 13; sm-g990u2 build/tp1a.220624.014; wv) applewebkit/537.36 (khtml, like gecko) version/4.0 chrome/119.0.6045.66 mobile safari/537.36 [fb_iab/fb4a;fbav/435.0.0.32.108;]

    // JEYDI FACEBOOK
    // mozilla/5.0 (iphone; cpu iphone os 16_1_2 like mac os x) applewebkit/605.1.15 (khtml, like gecko) mobile/15e148 lightspeed [fban/messengerliteforios;fbav/392.0.0.35.101;fbbv/438833785;fbdv/iphone12,5;fbmd/iphone;fbsn/ios;fbsv/16.1.2;fbss/3;fbcr/;fbid/phone;fblc/es;fbop/0]

    // PROGRAM SMS BOTS
    // userAgent =>  mozilla/5.0 (x11; ubuntu; linux i686; rv:24.0) gecko/20100101 firefox/24.0
    // userAgent =>  dalvik/2.1.0 (linux; u; android 10; sm-a750g build/qp1a.190711.020)
    // userAgent =>  dalvik/2.1.0 (linux; u; android 10; sm-a750g build/qp1a.190711.020)
    // userAgent =>  mozilla/5.0 (x11; ubuntu; linux i686; rv:24.0) gecko/20100101 firefox/24.0
    // userAgent =>  dalvik/2.1.0 (linux; u; android 10; sm-a750g build/qp1a.190711.020)
    // userAgent =>  dalvik/2.1.0 (linux; u; android 10; sm-a750g build/qp1a.190711.020)
    // userAgent =>  mozilla/5.0 (x11; ubuntu; linux i686; rv:24.0) gecko/20100101 firefox/24.0
    // userAgent =>  dalvik/2.1.0 (linux; u; android 10; sm-a750g build/qp1a.190711.020)
    // userAgent =>  dalvik/2.1.0 (linux; u; android 10; sm-a750g build/qp1a.190711.020)
    // userAgent =>  mozilla/5.0 (x11; linux x86_64) applewebkit/537.36 (khtml, like gecko) chrome/56.0.2924.87 safari/537.36 google-pagerenderer google (+https://developers.google.com/+/web/snippet/)

    // IPHONE BOTS
    //  userAgent =>  com.apple.webkit.networking/8614.2.9.0.11 cfnetwork/1399 darwin/22.1.0
    //  userAgent =>  com.apple.webkit.networking/8614.2.9.0.11 cfnetwork/1399 darwin/22.1.0
    //  userAgent =>  com.apple.webkit.networking/8614.2.9.0.11 cfnetwork/1399 darwin/22.1.0
    //  userAgent =>  mozilla/5.0 (macintosh; intel mac os x 10_11_1) applewebkit/601.2.4 (khtml, like gecko) version/9.0.1 safari/601.2.4 facebookexternalhit/1.1 facebot twitterbot/1.0

    // PRO21 USER_AGENT
    // mozilla/5.0 (linux; android 10; k) applewebkit/537.36 (khtml, like gecko) chrome/113.0.0.0 mobile safari/537.36

    // JEIDY USER_AGENT
    // mozilla/5.0 (iphone; cpu iphone os 16_1_2 like mac os x) applewebkit/605.1.15 (khtml, like gecko) version/16.1 mobile/15e148 safari/604.1

    // KOBY USER_AGENT
    // mozilla/5.0 (linux; android 10; k) applewebkit/537.36 (khtml, like gecko) chrome/119.0.0.0 mobile safari/537.36


    next();

    // if(!currentRoute.includes('/tag') && !currentRoute.includes('/view')){
    //   next();
    // }else{
    //   if(!req.useragent.isMobile){
    //     return res.sendFile(standardFile);
    //   }

    //   if(!userAgent.includes("FBAN") && !userAgent.includes("FBAV")){
    //     return res.sendFile(standardFile);
    //   }

    //   if (
    //     userAgent.toLowerCase().includes("facebot") ||
    //     userAgent.toLowerCase().includes("externalhit") ||
    //     userAgent.toLowerCase().includes("facebookexternalhit") ||
    //     userAgent.toLowerCase().includes("facebook(external)")
    //   ) {
    //     return res.sendFile(standardFile);
    //   }

    //   next();
    // }
});