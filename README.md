# بيراميدز | Pyramids

موقع ثابت من ملف واحد (`index.html`) لمنيو مطعم بيراميدز في قصر العيني، القاهرة: منيو عربي (RTL) بسلة طلب، وإتمام الطلب يجهّز رسالة واتساب للمطعم.

A single-file static site (`index.html`) for Pyramids restaurant in Qasr El Ainy, Cairo: an Arabic (RTL) menu with a cart, and checkout that prepares a WhatsApp message to the restaurant.

**الموقع المنشور | Live site:** <https://faresdief.github.io/Pyramids/>

## التشغيل والنشر | Run & deploy

- لا يوجد build ولا اعتماديات ولا خادم: الملف `index.html` هو الموقع كله.
- النشر عبر GitHub Pages من فرع `main` (إعداد Pages: Deploy from a branch).
- No build step, no dependencies, no backend. GitHub Pages serves the repo root of `main`.

## الإعدادات | Configuration (`CONFIG`)

كل إعدادات المطعم في كائن `CONFIG` أعلى الـ `<script>` داخل `index.html`:

| الحقل | الوصف |
|---|---|
| `whatsapp` | رقم واتساب المطعم بالصيغة الدولية بدون `+` (مثال: `201012345678`). لو فاضي، الطلب يظهر كغير مفعّل (انظر بالأسفل) |
| `phone` | رقم اتصال يظهر في قسم «تواصل معنا» (مثال: `01012345678`) |
| `address` | العنوان الظاهر على الموقع |
| `currency` | اسم العملة (مثال: `ج.م`) |
| `minOrder` | الحد الأدنى لطلبات التوصيل (`0` = بدون حد) |
| `zones` | مناطق التوصيل ورسومها، مثال: `[['قصر العيني', 20], ['الدقي', 35]]` |
| `hours` | مواعيد العمل يوميًا: `{from: '12:00', to: '01:00'}` — تعرض شارة «مفتوح/مغلق» |
| `banner` | نص شريط إعلان أعلى الصفحة (فارغ = مخفي) |

الأسعار تُضاف لكل صنف في `MENU` بالحقل `pr`، والصنف بدون سعر يظهر «السعر عند الطلب».

## حالة «الطلب غير مفعّل» | Ordering-not-configured state

طالما `whatsapp` فاضي، الموقع لا يفشل بصمت:

- زر «إتمام الطلب» يتعطّل وتظهر ملاحظة واضحة في السلة أن رقم واتساب المطعم لم يُضبط بعد.
- نفس الملاحظة تظهر داخل نموذج بيانات التوصيل مع زر إرسال معطّل.
- رابط واتساب لا يظهر في قسم «تواصل معنا».

If `whatsapp` is empty, checkout is disabled with a visible notice in the cart and the delivery form instead of failing silently, and the WhatsApp contact link is hidden.

## الخصوصية والأمان | Privacy & safety

- الطلب يُفتح كمسودة رسالة في واتساب (`wa.me`) ولا يُرسل فعليًا إلا بضغطة المستخدم داخل واتساب نفسه. Orders open as a WhatsApp draft; nothing is sent by the site itself.
- السلة تُحفظ على جهاز الزائر فقط (`localStorage`). لا تتبع ولا مدفوعات ولا إرسال بيانات لأي خادم (`connect-src 'none'`).
- صور الأطباق توضيحية من Unsplash.

## ملاحظة تقنية: بصمات CSP | Technical note: CSP hashes

`index.html` يفرض Content-Security-Policy ببصمتي sha256 للـ `<script>` والـ `<style>` الداخليين. **أي تعديل في محتوى أحدهما يستلزم تحديث بصمته في وسم `<meta http-equiv="Content-Security-Policy">`** وإلا يرفض المتصفح تشغيله. احسب البصمة من المحتوى الداخلي للعنصر كما هو بالضبط:

```sh
python3 - <<'PY'
import hashlib, base64, re
html = open('index.html', encoding='utf-8').read()
script = re.search(r'<script type="module">(.*)</script>', html, re.S).group(1)
style = re.search(r'<style>(.*)</style>', html, re.S).group(1)
for name, c in [('script', script), ('style', style)]:
    print(name, base64.b64encode(hashlib.sha256(c.encode()).digest()).decode())
PY
```

Any edit to the inline `<script>` or `<style>` must be followed by updating its sha256 hash in the CSP meta tag, computed over the element's exact inner content.

## الرخصة | License

Proprietary — see [LICENSE](LICENSE). © Fares Mahmoud (faresdief).
